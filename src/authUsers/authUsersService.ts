import { Request, Response } from 'express';
import * as hashService from '../services/hashPasswordService';
import * as jwtService from '../services/jwtService';
import { AuthUserException } from '../exceptions/AuthUserException';
import { AuthUser, IAuthUser } from '../models/AuthUser';

export const getAllUsers = async (): Promise<IAuthUser[]> => {
  try {
    const users = await AuthUser.find();
    if (!users || users.length === 0) {
      return [];
    }
    return users;
  } catch (err: any) {
    throw new AuthUserException('Error fetching users');
  }
};

export const getUserById = async (id: string): Promise<IAuthUser | null> => {
  try {
    const user = await AuthUser.findOne({ id: id });
    return user;
  } catch (err: any) {
    throw new AuthUserException('Error fetching user');
  }
};

export const addUser = async (user: Partial<IAuthUser>): Promise<IAuthUser> => {
  try {
    const hashedPassword = await hashService.hashPassword(user.password || '');
    
    const existingUsers = await AuthUser.find();
    const newId = existingUsers.length > 0 ? Math.max(...existingUsers.map((u: any) => parseInt(u.id as string))) + 1 : 1;

    const newUser = new AuthUser({
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
    throw new AuthUserException('Error creating user');
  }
};

export const updateUser = async (id: string, updateData: Partial<IAuthUser>): Promise<IAuthUser | null> => {
  try {
    if (updateData.password) {
      updateData.password = await hashService.hashPassword(updateData.password);
    }

    const updatedUser = await AuthUser.findByIdAndUpdate(id, updateData, { new: true });
    return updatedUser;
  } catch (err: any) {
    throw new AuthUserException('Error updating user');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await AuthUser.findByIdAndDelete(id);
  } catch (err: any) {
    throw new AuthUserException('Error deleting user');
  }
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const user = await AuthUser.findOne({ email });

    if (!user) {
      throw new AuthUserException('Invalid credentials');
    }

    const isPasswordValid = await hashService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthUserException('Invalid credentials');
    }

    const tokens = await jwtService.generateRealmUserToken(user as any);
    return tokens;
  } catch (error) {
    throw error;
  }
};
