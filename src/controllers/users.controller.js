import { User } from '../models/users.js';
import { existingUser } from '../services/user.services.js';

export async function registerUserController(req, res) {
  try {
    const { name, password, role } = req.body;
    if (!name || !password)
      return res.status(400).json({ message: 'Name and password required' });

    const userClone = await existingUser(name);
    if (userClone) {
      return res
        .status(409)
        .json({ message: 'User with this name already exist!' });
    }

    const newUser = await User.create({
      name,
      password,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Server error!' });
  }
}
