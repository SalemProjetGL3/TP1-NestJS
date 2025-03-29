// src/types/express.d.ts
import { User } from '../user/entities/user.entity'; 
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: User; 
    }
  }
}
