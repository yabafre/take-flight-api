import { Module } from '@nestjs/common';
import { BookingsService } from '@/bookings/bookings.service';
import { BookingsController } from '@/bookings/bookings.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {
  private static _configService: ConfigService;
  static forRoot(configService: ConfigService) {
    BookingsModule._configService = configService;
    return {
      module: BookingsModule,
      providers: [
        {
          provide: BookingsService,
          useFactory: (configService: ConfigService) => {
            configService.get<string>('STRIPE_SECRET_KEY');
            return new BookingsService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [BookingsService],
    };
  }
}
