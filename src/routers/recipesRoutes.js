import { Router } from 'express';
import { authenticante } from '../middlewares/authenticante.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getRecipeByIdController } from '../controllers/recipesControllers.js';
import { isValidIdRecipe } from '../middlewares/isValidIdRecipe.js';

const router = Router();

router.use(authenticante);

router.get('/:recipeId', isValidIdRecipe, ctrlWrapper(getRecipeByIdController));

export default router;
