import mongoose, { Document, Schema, Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

// -------------------- Interface --------------------
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  generateAuthToken(): string;
}

// -------------------- Schema --------------------
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
});

// -------------------- JWT Method --------------------
userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY as string, {
    expiresIn: '7d',
  });
};

// -------------------- Model --------------------
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// -------------------- Joi Validation --------------------
const validateUser = (req: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
};

// -------------------- Export --------------------
export { User, validateUser };
