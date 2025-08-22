import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, '../Recipes/recipes.json');

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

export const getRecipeByIdService = async (recipeId) => {
  const recipe = await recipes.find((recepie) => recepie._id.$oid === recipeId);
  return recipe;
};
