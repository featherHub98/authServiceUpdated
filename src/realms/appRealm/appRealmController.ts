import { Router, Request, Response } from 'express';
import * as appRealmService from './appRealmService';
import * as realmUsersService from '../realmUsers/realmUsersService';

interface RealmUser {
  id?: string | number;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  realmId: number;
}

const router = Router();

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    let realms = await appRealmService.getAllAppRealms();
    let realmUsers = await realmUsersService.getAllRealmUsers();

    // Organize realm users by realm
    let realmsWithUsers = realms.map((realm) => {
      return {
        ...realm,
        users: realmUsers.filter((user: RealmUser) => user.realmId == realm.id),
      };
    });
    return res.json({ realms: realmsWithUsers });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching realms' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    let realms = await appRealmService.getAllAppRealms();
    return res.json(realms);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching realms' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let realm = await appRealmService.getAppRealmById(id);
    if (!realm) {
      return res.status(404).json({ message: 'Realm not found' });
    }
    return res.json(realm);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching realm' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    let realm = { name, description };
    if (!realm)
      return res.status(400).json({ message: 'realm data is required' });
    const newRealm = await appRealmService.addAppRealm(realm);
    res.status(201).json(newRealm);
  } catch (err: any) {
    console.error('Error creating realm:', err);
    return res.status(500).json({ message: 'Error creating realm' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedRealm = await appRealmService.updateAppRealm(id, req.body);
    if (!updatedRealm) {
      return res.status(404).json({ message: 'Realm not found' });
    }
    res.json(updatedRealm);
  } catch (err: any) {
    console.error('Error updating realm:', err);
    return res.status(500).json({ message: 'Error updating realm' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await appRealmService.deleteAppRealm(id);
    res.json({ message: 'Realm deleted' });
  } catch (err: any) {
    console.error('Error deleting realm:', err);
    return res.status(500).json({ message: 'Error deleting realm' });
  }
});

export default router;
