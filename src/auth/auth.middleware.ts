import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
    // Supposons que vous avez une fonction qui vérifie le token
    // verifyToken(token).then((user) => {
    //   req.user = user;
    //   next();
    // }).catch((error) => {
    //   return res.status(401).json({ message: 'Unauthorized', details: error.message });
    // });
  }
}
