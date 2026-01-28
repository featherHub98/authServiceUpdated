import { Realm, IRealm } from '../../models/Realm';
import { AppRealmException } from '../../exceptions/AppRealmException';

export const getAllAppRealms = async (): Promise<IRealm[]> => {
  try {
    const realms = await Realm.find();
    return realms || [];
  } catch (err: any) {
    throw new AppRealmException('Error fetching realms');
  }
};

export const getAppRealmById = async (id: string): Promise<IRealm | null> => {
  try {
    const realm = await Realm.findOne({ id: id });
    return realm;
  } catch (err: any) {
    throw new AppRealmException('Error fetching realm');
  }
};

export const addAppRealm = async (realm: Partial<IRealm>): Promise<IRealm> => {
  try {
    const existingRealms = await Realm.find();
    const newId = existingRealms.length > 0 ? Math.max(...existingRealms.map((r: any) => Number.parseInt(r.id as string))) + 1 : 1;

    const newRealm = new Realm({
      id: newId.toString(),
      name: realm.name,
      description: realm.description,
    });

    const savedRealm = await newRealm.save();
    return savedRealm;
  } catch (err: any) {
    throw new AppRealmException('Error creating realm');
  }
};

export const updateAppRealm = async (id: string, updateData: Partial<IRealm>): Promise<IRealm | null> => {
  try {
    const updatedRealm = await Realm.findByIdAndUpdate(id, updateData, { new: true });
    return updatedRealm;
  } catch (err: any) {
    throw new AppRealmException('Error updating realm');
  }
};

export const deleteAppRealm = async (id: string): Promise<void> => {
  try {
    await Realm.findByIdAndDelete(id);
  } catch (err: any) {
    throw new AppRealmException('Error deleting realm');
  }
};
