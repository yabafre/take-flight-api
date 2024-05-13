import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseService } from '@/supabase/supabase.service';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {
  private static _configService: ConfigService;
  static forRoot(configService: ConfigService) {
    SupabaseModule._configService = configService;
    return {
      module: SupabaseModule,
      providers: [
        {
          provide: SupabaseService,
          useFactory: (configService: ConfigService) => {
            configService.get<string>('SUPABASE_URL');
            configService.get<string>('SUPABASE_API_KEY');
            return new SupabaseService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [SupabaseService],
    };
  }
}
