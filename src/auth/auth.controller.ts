// auth.controller.ts
import { Controller, Get, Request } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(@Request() req: ExpressRequest) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      return await this.authService.validateUser(token);
    } catch (err) {
      return null;
    }
  }
}
