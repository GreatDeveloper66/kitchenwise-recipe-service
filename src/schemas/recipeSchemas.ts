import { z } from "zod";

export const UNITS = ["g", "ml", "oz", "lb", "each", "tsp", "tbsp", "cup", "slice"] as const;

// ----- Request -----
export const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  quantity: z.string().optional(),
});

export const RecipeRequestSchema = z.object({
  id: z.string(),
  name: z.enum(["breakfast", "lunch", "dinner"]),
  foods: z.array(FoodItemSchema).min(1),
});

// ----- Response -----
// OpenAI structured outputs require every field to be present, so optional values are nullable.
export const IngredientSchema = z.object({
  name: z.string().describe("Ingredient as a shopper would say it, e.g. 'large eggs'"),
  standardName: z
    .string()
    .nullable()
    .describe("Exact match from the provided standard ingredient list, or null if none fits"),
  quantity: z.number().positive(),
  unit: z.enum(UNITS),
  preparation: z.string().nullable().describe("e.g. 'diced', 'scrambled', or null"),
  display: z.string().describe("Human-readable line, e.g. '2 large eggs, scrambled'"),
});

export const RecipeSchema = z.object({
  title: z.string(),
  servings: z.number().int().positive(),
  prepTime: z.number().int().nonnegative().describe("minutes"),
  cookTime: z.number().int().nonnegative().describe("minutes"),
  description: z.string(),
  ingredients: z.array(IngredientSchema).min(1),
  directions: z.array(z.string()).min(1),
});

export type RecipeRequest = z.infer<typeof RecipeRequestSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
