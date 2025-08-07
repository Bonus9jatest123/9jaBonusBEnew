import jwt from 'jsonwebtoken';
import { User } from '@/models/user';
import { connectDb } from '@/lib/startup/connectDb';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload;
}

export async function authorize(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: (err?: any) => void
) {
  const token = req.headers['x-auth-token'] as string | undefined;
  //   const cookies = cookie.parse(req.headers.cookie || '');
  // const token = cookies.token;
   

  if (!token) {
    return res.status(401).json({status:false, message:'Access denied. No token provided.' });
  }

  await connectDb();

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({status:false, message:'User not found' });
    }
    if (user.auth_token !== token) {
      return res.status(401).json({status:false, message:'Invalid or expired token.Please login again.' });
    }
    req.user = decoded;
    next();

  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({status:false, message: 'Invalid or expired token. Please login again.' });
    }

    console.error('Auth error:', err);
    return res.status(401).json({status:false, message: 'Invalid or expired token. Please login again.' });
  }
}
