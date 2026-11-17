# kitchenwise-recipe-service

Generates a recipe for one meal from its food list using the OpenAI API. Branch: `main`. Deployed at https://meal-recipe-service.vercel.app (old name, do not rename).

Stack: Node.js, TypeScript, Express 5, OpenAI via the Vercel AI SDK (schema-enforced structured output), Zod, Helmet, CORS.

## Routes

| Method | Route |
|---|---|
| GET | /api/health |
| POST | /api/get-recipe |

`get-recipe` request body: `{ id, name: "breakfast"|"lunch"|"dinner", foods: [{ id, name, calories, protein, carbs, fat, quantity? }] }` (one meal from a meal plan). Validated by `RecipeRequestSchema` in `src/schemas/recipeSchemas.ts`; `foods` must be non-empty.

Response: `{ title, servings, prepTime, cookTime, description, ingredients, directions }`. Each ingredient is `{ name, standardName, quantity, unit, preparation, display }`:

- `quantity` is a number and `unit` is one of `g | ml | oz | lb | each | tsp | tbsp | cup | slice`.
- `standardName` is an exact entry from `src/data/standardIngredients.ts`, or `null` when there is no match (no price available). The service normalizes it after generation and never trusts the model's match.
- `preparation` is a string or `null`; `display` is the human-readable line.

Errors: `400 { error, details }` for an invalid body; `502 { error }` when OpenAI fails or returns output that doesn't match the schema.

## Contract history

- `get-recipe` moved from GET to POST (GET bodies are dropped by some clients and proxies). Postman requests must use POST.
- Ingredients moved from plain strings to structured objects so they can be matched against grocery data. This covers the project decision `{ name, quantity, unit }` and adds `standardName`, `preparation`, and `display`. The frontend has no recipe client yet; build it against this shape.

## Rules

- Env: `OPENAI_API_KEY`, `OPENAI_MODEL` (optional, default `gpt-4o-mini`), `CORS_ORIGIN` (unset allows every origin), `PORT`. Never hardcode or log the API key.
- `src/index.ts` only calls `app.listen()` when `NODE_ENV !== "production"`; Vercel uses the default export.
- `src/data/standardIngredients.ts` is a hand-copied list of `standard_name` values from kitchenwise-grocery-service `data/foods_prices.ts`. Keep it in sync when the price list changes.
- `vercel.json` lives in `src/`. Vercel reads it only from the project's Root Directory, so check the Vercel project settings before moving or relying on it.
