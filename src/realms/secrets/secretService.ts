import { Secret, ISecret } from '../../models/Secret';

export const getRealmSecretByRealmId = async (realmId: number): Promise<ISecret | null> => {
  try {
    const secret = await Secret.findOne({ realmId });
    return secret;
  } catch (err: any) {
    throw new Error('Error fetching secret');
  }
};

export const addSecret = async (secret: Partial<ISecret>): Promise<ISecret> => {
  try {
    const existingSecrets = await Secret.find();
    const newRealmId = existingSecrets.length > 0 ? Math.max(...existingSecrets.map((s: any) => s.realmId)) + 1 : 1;

    const newSecret = new Secret({
      realmId: newRealmId,
      realmSecret: secret.realmSecret,
    });

    const savedSecret = await newSecret.save();
    return savedSecret;
  } catch (err: any) {
    throw new Error('Error creating secret');
  }
};

export const updateSecret = async (realmId: number, updateData: Partial<ISecret>): Promise<ISecret | null> => {
  try {
    const updatedSecret = await Secret.findOneAndUpdate({ realmId }, updateData, { new: true });
    return updatedSecret;
  } catch (err: any) {
    throw new Error('Error updating secret');
  }
};
