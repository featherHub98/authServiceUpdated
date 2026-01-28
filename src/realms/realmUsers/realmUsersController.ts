import { Router, Request, Response } from 'express';
import * as realmUsersService from './realmUsersService';
import * as jwtService from '../../services/jwtService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await realmUsersService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await realmUsersService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, username, password, roles, realmId } = req.body;
    let user = { email, username, password, roles, realmId };
    if (!user) return res.status(400).json({ message: 'user data is required' });
    const newUser = await realmUsersService.addUser(user);
    return res.status(201).json(newUser);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedUser = await realmUsersService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await realmUsersService.deleteUser(id);
    return res.json({ message: 'User deleted' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const tokens = await realmUsersService.loginUser(email, password);
    return res.json(tokens);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    let { refreshToken } = req.body;
    console.log(refreshToken);
    let type: 'realmUser' = 'realmUser';
    let data = await jwtService.generateTokenUsingRefreshToken(
      refreshToken,
      type
    );

    return res.json({ data });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  try {
    let { accessToken } = req.body;
    let type: 'realmUser' = 'realmUser';
    let isVerified = await jwtService.verifyAccessToken(accessToken, type);
    return res.json({ isVerified });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
