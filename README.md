# kitchenwise-recipe-service

A microservice that generates recipes from a meal's food list using the OpenAI API. Part of the KitchenWise application — a full-stack microservice architecture for personalized meal planning and local grocery store discovery.

---

## Overview

Given a meal (breakfast, lunch, or dinner) and the foods assigned to it in a meal plan, this service asks OpenAI to produce a complete recipe and returns it as structured JSON: title, servings, prep and cook times, description, ingredients, and directions. The service is deployed on Vercel.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **AI:** OpenAI API
- **Security:** Helmet, CORS
- **Deployment:** Vercel

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/get-recipe` | Generate a recipe for a meal |

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
  ingredients: string[]
  directions: string[]
}
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key
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

---

## Known Limitations

- `get-recipe` reads its input from the request body of a GET request; some clients and proxies drop GET bodies, so this will likely move to POST.
- Ingredients are currently returned as plain strings. Structured ingredients (name, quantity, unit) for matching against grocery data are planned.

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
