import { Module } from '@nestjs/common';
import { SearchController } from '@/search/search.controller';
import { SearchService } from '@/search/search.service';
import { AmadeusModule } from '@/amadeus/amadeus.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [AmadeusModule, PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
