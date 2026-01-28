import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthRealm extends Document {
  id?: number;
  name: string;
  description: string;
}

const authRealmSchema = new Schema<IAuthRealm>(
  {
    id: Number,
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const AuthRealm = mongoose.model<IAuthRealm>('AuthRealm', authRealmSchema);
