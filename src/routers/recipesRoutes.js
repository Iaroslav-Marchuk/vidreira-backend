import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getRecipeByIdController } from '../controllers/recipesControllers.js';
import { isValidIdRecipe } from '../middlewares/isValidIdRecipe.js';

const router = Router();

router.get('/:recipeId', isValidIdRecipe, ctrlWrapper(getRecipeByIdController));

export default router;
