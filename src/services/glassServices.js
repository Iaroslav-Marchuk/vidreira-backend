import { glassOptions } from '../constants/glassOptions.js';
import createHttpError from 'http-errors';

export const getGlassOptionsService = () => {
  if (!glassOptions) {
    throw createHttpError(404, 'Glass options not found!');
  }
  return glassOptions;
};
