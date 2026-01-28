import mongoose, { Schema, Document } from 'mongoose';

export interface IRealmUser extends Document {
  id?: string | number;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  realmId: number;
}

const realmUserSchema = new Schema<IRealmUser>(
  {
    id: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: [String],
    realmId: { type: Number, required: true },
  },
  { timestamps: true }
);

export const RealmUser = mongoose.model<IRealmUser>('RealmUser', realmUserSchema);
