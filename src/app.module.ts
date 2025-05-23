import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { BookingsModule } from '@/bookings/bookings.module';
import { PaymentsModule } from '@/payments/payments.module';
import { SearchModule } from '@/search/search.module';
import { UsersController } from '@/users/users.controller';
import { BookingsController } from '@/bookings/bookings.controller';
import { PaymentsController } from '@/payments/payments.controller';
import { SupabaseModule } from '@/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from '@/auth/auth.middleware';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { AmadeusModule } from '@/amadeus/amadeus.module';
import { AssistantModule } from '@/assistant/assistant.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    BookingsModule,
    PaymentsModule,
    SearchModule,
    SupabaseModule,
    WebhooksModule,
    AmadeusModule,
    AssistantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController, BookingsController, PaymentsController);
  }
}
