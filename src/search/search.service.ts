import { Injectable } from '@nestjs/common';
import { AmadeusService } from '@/amadeus/amadeus.service';

@Injectable()
export class SearchService {
  constructor(private readonly amadeusService: AmadeusService) {}

  async searchHotels(cityCode: string): Promise<any> {
    return this.amadeusService.getHotelOffersByCityCode(cityCode);
  }
}
