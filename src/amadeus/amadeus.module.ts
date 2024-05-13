import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmadeusService } from '@/amadeus/amadeus.service';

@Module({
  imports: [ConfigModule],
  providers: [AmadeusService],
  exports: [AmadeusService],
})
export class AmadeusModule {
  private static _configService: ConfigService;
  static forRoot(configService: ConfigService) {
    AmadeusModule._configService = configService;
    return {
      module: AmadeusModule,
      providers: [
        {
          provide: AmadeusService,
          useFactory: (configService: ConfigService) => {
            configService.get<string>('NEST_PUBLIC_AMADEUS_API_KEY');
            configService.get<string>('NEST_PUBLIC_AMADEUS_API_SECRET');
            configService.get<string>('NEST_PUBLIC_RAPID_API_KEY');
            return new AmadeusService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [AmadeusService],
    };
  }
}
