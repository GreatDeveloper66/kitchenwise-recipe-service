import type { Request, Response } from "express";
import { generateText, Output, type LanguageModel } from "ai";
import { openai } from "@ai-sdk/openai";
import { RecipeRequestSchema, RecipeSchema, UNITS, type Recipe, type RecipeRequest } from "../schemas/recipeSchemas.js";
import { STANDARD_INGREDIENTS, isStandardIngredient } from "../data/standardIngredients.js";

// Reads OPENAI_API_KEY from the environment.
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const buildPrompt = ({ name, foods }: RecipeRequest): string => {
  const foodList = foods.map((food) => (food.quantity ? `${food.quantity} ${food.name}` : food.name)).join(", ");
  return `Generate a ${name} recipe that uses these foods: ${foodList}.

For every ingredient:
- quantity is a number and unit is one of: ${UNITS.join(", ")}. Use "each" for countable items such as eggs or bananas.
- standardName must be copied exactly from this list when the ingredient matches one of its items, otherwise null:
${STANDARD_INGREDIENTS.join(", ")}
- Pantry items such as salt, pepper, oil, or spices are allowed and usually have standardName null.`;
};

// Never trust the model's matching: anything not on the list becomes null ("price unavailable").
export const normalizeRecipe = (recipe: Recipe): Recipe => ({
  ...recipe,
  ingredients: recipe.ingredients.map((ingredient) => {
    const standard = ingredient.standardName?.trim().toLowerCase() ?? null;
    return { ...ingredient, standardName: standard && isStandardIngredient(standard) ? standard : null };
  }),
});

export const generateRecipe = async (
  request: RecipeRequest,
  model: LanguageModel = openai(MODEL),
): Promise<Recipe | null> => {
  const { output } = await generateText({
    model,
    output: Output.object({ schema: RecipeSchema, name: "recipe" }),
    prompt: buildPrompt(request),
  });
  return output ? normalizeRecipe(output) : null;
};

export const getRecipe = async (req: Request, res: Response) => {
  const parsed = RecipeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  try {
    const recipe = await generateRecipe(parsed.data);
    if (!recipe) {
      return res.status(502).json({ error: "No recipe returned from OpenAI" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Recipe generation failed:", error);
    return res.status(502).json({ error: "Recipe generation failed" });
  }
};
