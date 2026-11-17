# kitchenwise-recipe-service

A microservice that generates recipes from a meal's food list using the OpenAI API. Part of the KitchenWise application — a full-stack microservice architecture for personalized meal planning and local grocery store discovery.

---

## Overview

Given a meal (breakfast, lunch, or dinner) and the foods assigned to it in a meal plan, this service asks OpenAI to produce a complete recipe and returns it as structured JSON: title, servings, prep and cook times, description, ingredients, and directions.

Each ingredient comes back as structured data (quantity, unit, and a `standardName`) so it can be matched against grocery price data. `standardName` is filled only when the ingredient matches the standard ingredient list in `src/data/standardIngredients.ts` (copied from the grocery service's price list); otherwise it is `null`, meaning no price is available. The service is deployed on Vercel.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **AI:** OpenAI via the Vercel AI SDK (schema-enforced structured output)
- **Validation:** Zod
- **Security:** Helmet, CORS
- **Deployment:** Vercel

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/get-recipe` | Generate a recipe for a meal |

---

## Request Schema

```typescript
{
  id: string
  name: "breakfast" | "lunch" | "dinner"
  foods: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    quantity?: string
  }[]
}
```

## Response Schema

```typescript
{
  title: string
  servings: number
  prepTime: number      // minutes
  cookTime: number      // minutes
  description: string
  ingredients: {
    name: string                 // "large eggs"
    standardName: string | null  // "egg"; null = not in the price list (price unavailable)
    quantity: number             // 2
    unit: "g" | "ml" | "oz" | "lb" | "each" | "tsp" | "tbsp" | "cup" | "slice"
    preparation: string | null   // "scrambled"
    display: string              // "2 large eggs, scrambled"
  }[]
  directions: string[]
}
```

Invalid requests return `400` with validation details. If OpenAI fails or returns output that doesn't match the schema, the service returns `502`.

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini   # optional, this is the default
CORS_ORIGIN=allowed_frontend_origin
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- OpenAI API key

### Installation

```bash
git clone https://github.com/GreatDeveloper66/kitchenwise-recipe-service.git
cd kitchenwise-recipe-service
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

The server only calls `app.listen()` when `NODE_ENV` is not `production`. On Vercel the exported app is used instead, so `npm start` with `NODE_ENV=production` set locally will not serve requests.

If `CORS_ORIGIN` is not set, CORS allows every origin.

---

## Known Limitations

- The standard ingredient list is a copy of the grocery service's price list and must be kept in sync by hand.
- Pricing comes from a static mock price list; ingredients outside it have no price.

---

## Project Architecture

This repository is one of seven components in the KitchenWise application (six backend microservices plus the React frontend):

| Repository | Responsibility |
|---------|---------------|
| [kitchenwise-frontend](https://github.com/GreatDeveloper66/kitchenwise-frontend) | React + TypeScript frontend |
| [user-auth-service](https://github.com/GreatDeveloper66/user-auth-service) | Authentication & JWT management |
| [kitchenwise-diet-profile-service](https://github.com/GreatDeveloper66/kitchenwise-diet-profile-service) | Diet profile storage & management |
| [kitchenwise-meal-plan-service](https://github.com/GreatDeveloper66/kitchenwise-meal-plan-service) | AI-powered meal plan generation |
| [kitchenwise-plan-storage-service](https://github.com/GreatDeveloper66/kitchenwise-plan-storage-service) | User meal plan storage |
| [kitchenwise-grocery-service](https://github.com/GreatDeveloper66/kitchenwise-grocery-service) | Grocery store discovery by location (Google Places) |
| **[kitchenwise-recipe-service](https://github.com/GreatDeveloper66/kitchenwise-recipe-service)** | AI recipe generation |
