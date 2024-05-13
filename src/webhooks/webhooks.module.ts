import { Module } from '@nestjs/common';
import { WebhooksController } from '@/webhooks/webhooks.controller';
import { UsersModule } from '@/users/users.module';
import { WebhooksService } from '@/webhooks/webhooks.service';

@Module({
  imports: [UsersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
