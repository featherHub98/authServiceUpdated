import { AuthRealm, IAuthRealm } from '../../models/AuthRealm';
import { AuthRealmException } from '../../exceptions/AuthRealmException';

export const getAuthRealm = async (): Promise<IAuthRealm[]> => {
  try {
    const realms = await AuthRealm.find();
    return realms || [];
  } catch (err: any) {
    throw new AuthRealmException('Error fetching auth realms');
  }
};

export const addAuthRealm = async (realm: Partial<IAuthRealm>): Promise<IAuthRealm> => {
  try {
    const existingRealms = await AuthRealm.find();
    const newId = existingRealms.length > 0 ? Math.max(...existingRealms.map((r: any) => Number.parseInt(r.id as string))) + 1 : 1;

    const newRealm = new AuthRealm({
      id: newId,
      name: realm.name,
      description: realm.description,
    });

    const savedRealm = await newRealm.save();
    return savedRealm;
  } catch (err: any) {
    throw new AuthRealmException('Error creating auth realm');
  }
};

