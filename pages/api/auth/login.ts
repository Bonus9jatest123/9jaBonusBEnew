
import type { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '@/models/user';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';



export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  // }

  console.log('req:- '+JSON.stringify(req));

  try {
    await connectDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email });
 
    if (!user) return res.status(400).json({ status: false, message: 'Invalid email or password.' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ status: false, message: 'Invalid email or password.' });
    if(user.status != 1) {
      return res.status(403).json({ status: false, message: 'Your profile is pending yet.please contact to admin' });
    }
    const token = user.generateAuthToken();
    user.auth_token = token;
    await user.save();
    user.password = ''; // Remove password from response
    return res.status(200)
      .json({ token, user , status: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

function validate(req: any) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().required()
  });

  return schema.validate(req);
}
