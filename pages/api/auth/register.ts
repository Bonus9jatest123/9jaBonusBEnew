// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcryptjs from 'bcryptjs';
import { User, validateUser } from '@/models/user'; // Adjust path based on your structure
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
 

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await connectDb();
        const { name, email, password } = req.body;

        const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
            
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = user.generateAuthToken();

        return res.status(200)
            .setHeader('x-auth-token', token)
            .json({ token, _id: user._id, email: user.email, name: user.name  });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
