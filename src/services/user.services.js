import { User } from '../models/user.model.js';

export function existingUser(name) {
  return User.findOne({ name });
}

export function logOutUserService(userId) {
  return;
}
