import { Router, Request, Response } from 'express';
import * as secretService from './secretService';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const realmId = Number.parseInt(req.params.id);
    const secret = await secretService.getRealmSecretByRealmId(realmId);
    if (!secret) {
      return res.status(404).json({ message: 'Secret not found' });
    }
    return res.json(secret);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching secret' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { realmSecret } = req.body;
    let secret = { realmSecret };
    if (!secret) return res.status(400).json({ message: 'secret data is required' });
    const newSecret = await secretService.addSecret(secret);
    return res.status(201).json(newSecret);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating secret' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const realmId = Number.parseInt(req.params.id);
    const { realmSecret } = req.body;
    const updatedSecret = await secretService.updateSecret(realmId, { realmSecret });
    if (!updatedSecret) {
      return res.status(404).json({ message: 'Secret not found' });
    }
    return res.json(updatedSecret);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating secret' });
  }
});

export default router;
