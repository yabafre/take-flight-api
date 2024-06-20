// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SUPABASE_JWT_SECRET,
      });
      console.log('decoded:', decoded);
      return await this.usersService.getUserById(decoded.sub);
    } catch (err) {
      return null;
    }
  }

  login() {
    return Promise.resolve(undefined);
  }
}
