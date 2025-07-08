import { User } from '../models/users.js';

export function existingUser(name) {
  return User.findOne({ name });
}
