 
import type { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import { User } from '@/models/user';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';



export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');
      

   const token = user.generateAuthToken();

  res.send(token);
    // return res.status(200)
    //   .setHeader('x-auth-token', token)
    //   .json({ token, user: { _id: user._id, email: user.email, name: user.name } });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

function validate(req:any) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().required()
  });

  return schema.validate(req);
}
