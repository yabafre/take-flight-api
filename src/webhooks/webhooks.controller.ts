import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly usersService: UsersService) {}

  @Post('supabase')
  async handleSupabaseEvent(@Body() data: any) {
    const { type, record, old_record } = data;
    console.log('Received event:', type, record, old_record);

    try {
      switch (type) {
        case 'INSERT':
          return await this.usersService.createUser(record);
        case 'UPDATE':
          return await this.usersService.updateUser(record.id, record);
        case 'DELETE':
          return await this.usersService.deleteUser(old_record.id);
        default:
          throw new HttpException(
            'Unsupported event type',
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
