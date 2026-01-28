import mongoose, { Schema, Document } from 'mongoose';

export interface ISecret extends Document {
  realmId?: number;
  realmSecret: string;
}

const secretSchema = new Schema<ISecret>(
  {
    realmId: { type: Number, unique: true },
    realmSecret: { type: String, required: true },
  },
  { timestamps: true }
);

export const Secret = mongoose.model<ISecret>('Secret', secretSchema);
