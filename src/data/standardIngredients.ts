// Standard ingredient names used to match recipe ingredients to grocery price data.
// Copied from kitchenwise-grocery-service/data/foods_prices.ts ("standard_name" field), commit 7046f49.
// Keep this list in sync when the price list changes.
export const STANDARD_INGREDIENTS = [
  "egg", "chicken breast", "oatmeal", "broccoli", "salmon", "quinoa", "almonds", "banana",
  "greek yogurt", "spinach", "sweet potato", "peanut butter", "apple", "brown rice", "carrot",
  "cottage cheese", "turkey breast", "avocado", "black beans", "protein shake", "mixed nuts",
  "whole wheat bread", "hummus", "celery", "watermelon", "tofu", "chia seeds", "edamame",
  "cucumber", "lentils", "dark chocolate", "green tea", "coffee", "water", "orange",
  "pumpkin seeds", "bell pepper", "zucchini", "mushrooms", "asparagus", "brussels sprouts",
  "cauliflower", "kale", "chia pudding", "smoothie bowl", "granola bar", "rice cakes",
  "turkey jerky", "popcorn", "edamame snack", "protein balls", "fruit salad", "veggie sticks",
  "honey", "maple syrup", "almond milk", "pancakes", "waffles", "turkey sandwich",
] as const;

const standardSet = new Set<string>(STANDARD_INGREDIENTS);

export const isStandardIngredient = (name: string): boolean => standardSet.has(name);
