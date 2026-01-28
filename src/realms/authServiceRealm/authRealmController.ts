import { Router, Request, Response } from 'express';
import * as authRealmService from './authRealmService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const realms = await authRealmService.getAuthRealm();
    return res.json(realms);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching realms' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    let realm = { name, description };
    if (!realm) return res.status(400).json({ message: 'realm data is required' });
    const newRealm = await authRealmService.addAuthRealm(realm);
    return res.status(201).json(newRealm);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating realm' });
  }
});

export default router;
