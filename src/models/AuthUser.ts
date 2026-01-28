import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthUser extends Document {
  id?: string | number;
  email: string;
  password: string;
  username: string;
  roles?: string[];
  realmId?: number;
}

const authUserSchema = new Schema<IAuthUser>(
  {
    id: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    roles: [String],
    realmId: Number,
  },
  { timestamps: true }
);

export const AuthUser = mongoose.model<IAuthUser>('AuthUser', authUserSchema);
