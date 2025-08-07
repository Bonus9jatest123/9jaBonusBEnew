import type { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '@/models/user';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
import { authorize } from '@/middleware/authorize';
const jwt = require('jsonwebtoken');

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDb();

    // Authenticate user (adds `req.user`)
 

    const { error } = validateChangePassword(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const {password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: 'New password and confirm password must match.' });
    }
     const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
        const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ status: false, message: 'User not found.' });

    const hashedpassword = await bcrypt.hash(password, 10);
    user.password = hashedpassword;
    await user.save();

    return res.status(200).json({ status: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

function validateChangePassword(data: any) {
  const schema = Joi.object({
    password: Joi.string().min(6).required().messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters',
    }),
    confirmPassword: Joi.string().required().messages({
      'string.empty': 'Confirm password is required',
    }),
  });

  return schema.validate(data);
}
