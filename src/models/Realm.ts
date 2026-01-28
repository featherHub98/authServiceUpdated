import mongoose, { Schema, Document } from 'mongoose';

export interface IRealm extends Document {
  id?: string | number;
  name: string;
  description: string;
}

const realmSchema = new Schema<IRealm>(
  {
    id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Realm = mongoose.model<IRealm>('Realm', realmSchema);
