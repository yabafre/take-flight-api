import { Module } from '@nestjs/common';
import { AssistantService } from '@/assistant/assistant.service';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AssistantService, AmadeusService],
  exports: [AssistantService],
})
export class AssistantModule {
  private static _configService: ConfigService;

  static forRoot(configService: ConfigService) {
    AssistantModule._configService = configService;
    return {
      module: AssistantModule,
      providers: [
        {
          provide: AssistantService,
          useFactory: (
            configService: ConfigService,
            amadeusService: AmadeusService,
          ) => {
            configService.get<string>('NEST_PUBLIC_OPENAI_API_KEY');
            configService.get<string>('NEST_PUBLIC_GOOGLE_MAPS_API_KEY');
            return new AssistantService(configService, amadeusService);
          },
          inject: [ConfigService, AmadeusService],
        },
      ],
      exports: [AssistantService],
    };
  }
}
