import { RealmUser, IRealmUser } from '../../models/RealmUser';
import * as hashService from '../../services/hashPasswordService';
import * as jwtService from '../../services/jwtService';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const getAllUsers = async (): Promise<IRealmUser[]> => {
  try {
    const users = await RealmUser.find();
    return users || [];
  } catch (err: any) {
    throw new Error('Error fetching users');
  }
};

export const getAllRealmUsers = async (): Promise<IRealmUser[]> => {
  try {
    const users = await RealmUser.find();
    return users || [];
  } catch (err: any) {
    return [];
  }
};

export const getUserById = async (id: string): Promise<IRealmUser | null> => {
  try {
    const user = await RealmUser.findOne({ id: id });
    return user;
  } catch (err: any) {
    throw new Error('Error fetching user');
  }
};

export const addUser = async (user: Partial<IRealmUser>): Promise<IRealmUser> => {
  try {
    const hashedPassword = await hashService.hashPassword(user.password || '');
    const existingUsers = await RealmUser.find();
    const newId = existingUsers.length > 0 ? Math.max(...existingUsers.map((u: any) => Number.parseInt(u.id as string))) + 1 : 1;

    const newUser = new RealmUser({
      id: newId.toString(),
      email: user.email,
      username: user.username,
      password: hashedPassword,
      roles: user.roles || [],
      realmId: user.realmId,
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (err: any) {
    throw new Error('Error creating user');
  }
};

export const updateUser = async (id: string, updateData: Partial<IRealmUser>): Promise<IRealmUser | null> => {
  try {
    if (updateData.password) {
      updateData.password = await hashService.hashPassword(updateData.password);
    }

    const updatedUser = await RealmUser.findByIdAndUpdate(id, updateData, { new: true });
    return updatedUser;
  } catch (err: any) {
    throw new Error('Error updating user');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await RealmUser.findByIdAndDelete(id);
  } catch (err: any) {
    throw new Error('Error deleting user');
  }
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    if (!email || !password) {
      throw new Error('email and password are required');
    }

    const user = await RealmUser.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await hashService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokens = await jwtService.generateRealmUserToken(user as any);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (error: any) {
    throw error;
  }
};
