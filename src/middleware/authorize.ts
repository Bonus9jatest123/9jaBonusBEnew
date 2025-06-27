import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  _id: string,
  name: string,
  email: string,
  // Extend this as needed: email, role, etc.
  [key: string]: any;
}

// Extend the request to attach `user`
export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload;
}

// export function authorize(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     const token = req.headers['x-auth-token'] as string | undefined;

//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
//       (req as AuthenticatedRequest).user = decoded;
//       return handler(req as AuthenticatedRequest, res);
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   };
// }


 

export async function authorize(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: (err?: any) => void
) {
  const token = req.headers['x-auth-token'] as string | undefined;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;

    req.user = decoded;
    next();
    
  } catch (err) {
    console.log(err, 'errorr')
    return res.status(401).json({ message: 'Invalid token' });
  }
}



// export function authorize(req: NextApiRequest, res: NextApiResponse, next: Function) {
//   const token = req.headers['x-auth-token'] as string | undefined;

//   if (!token) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

//   try {
//    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
//     (req as AuthenticatedRequest).user = decoded;
//       return handler(req as AuthenticatedRequest, res);

//     next(); // continue
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }

