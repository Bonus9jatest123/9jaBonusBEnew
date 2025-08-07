// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { User, validateUser, UserStatus, RoleStatus } from '@/models/user'; // Adjust path based on your structure
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';


export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({status:false, message: 'Method Not Allowed' });
    }

    try {
        await connectDb();
        const { name, email, password } = req.body;
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({status:false, message: error.details[0].message }) ;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({status:false, message:'User already exists' }) ;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const lastUser = await User.findOne().sort('-order'); // find user with max order
        const newOrder = lastUser && lastUser?.order ? lastUser.order + 1 : 1;
        const user = new User({
            name,
            email,
            password: hashedPassword,
            status: UserStatus.Pending, // or UserStatus.Approved
            role: RoleStatus.User,
            order: newOrder,
            permission: [], // optional
        });
        const token = user.generateAuthToken();
        user.auth_token = token;
        await user.save();
         
        return res.status(200)
            .setHeader('x-auth-token', token)
            .json({ token, _id: user._id, email: user.email, name: user.name });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
