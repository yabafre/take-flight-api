import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<any, 'public', any>;

  constructor(configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseApiKey = configService.get<string>('SUPABASE_API_KEY');

    this.supabase = createClient(supabaseUrl, supabaseApiKey);
  }

  getSupabase() {
    return this.supabase;
  }
}
