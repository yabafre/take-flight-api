import { Module } from '@nestjs/common';
import { SearchController } from '@/search/search.controller';
import { SearchService } from '@/search/search.service';
import { AssistantService } from '@/assistant/assistant.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [SearchService, AssistantService, PrismaService, AmadeusService],
  exports: [SearchService],
})
export class SearchModule {}
