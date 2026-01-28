import { Router, Request, Response } from 'express';
import * as authUserService from './authUsersService';
import * as jwtService from '../services/jwtService';

const router = Router();

router.get('/users', async (req: Request, res: Response) => {
  try {
    let users = await authUserService.getAllUsers();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'could not reach DB' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await authUserService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;
    const user = { username, email, password, roles };
    if (!user) return res.status(400).json({ message: 'user data is required' });
    const newUser = await authUserService.addUser(user);
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedUser = await authUserService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await authUserService.deleteUser(id);
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const tokens = await authUserService.loginUser(email, password);
    return res.json(tokens);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    let { refreshToken } = req.body;
    console.log(refreshToken);
    let type: 'authUser' = 'authUser';
    let data = await jwtService.generateTokenUsingRefreshToken(
      refreshToken,
      type
    );

    return res.json({ data });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
