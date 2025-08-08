
import type { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '@/models/user';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
import getEmailTemplate from '@/components/EmailTemplate';
const nodemailer = require('nodemailer');


export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDb();
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({ status: false, message: 'Email  are required.' });
    }
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ status: false, message: 'User Not Found' });

    if (user.status != 1) {
      return res.status(403).json({ status: false, message: 'Your profile is pending yet.please contact to admin' });
    }
 
    const htmlTemplate = getEmailTemplate(user.auth_token);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASS?.trim(),
  },
    });


    try {
      await transporter.sendMail({
        from: `"Your App" <${process.env.FROM_USER}>`,
        to: email,
        subject: 'Password Reset',
        html: htmlTemplate,
      });
 

      return res.status(200).json({ message: 'Email sent to your registered Email Id' });
    } catch (error) {
      console.error('Email error:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

function validate(req: any) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(255).required(),

  });

  return schema.validate(req);
}
