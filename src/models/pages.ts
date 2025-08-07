import mongoose, { Document, Schema, Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
export interface IPage extends Document {
  name: string;
}
// -------------------- Schema --------------------
const PageSchema = new Schema<IPage>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ enables createdAt and updatedAt
  }
);
// -------------------- Model --------------------
const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
export { Page };
