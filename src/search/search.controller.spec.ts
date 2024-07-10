import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { AssistantService } from '@/assistant/assistant.service';
import { SearchFlightDto } from '@/search/dto/search-flight.dto';

describe('SearchController', () => {
  let controller: SearchController;
  let amadeusService: AmadeusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: AmadeusService,
          useValue: {
            getFlightOffers: jest.fn(),
            // Mock other methods used in the controller
          },
        },
        {
          provide: AssistantService,
          useValue: {
            filterResults: jest.fn(),
            // Mock other methods used in the controller
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    amadeusService = module.get<AmadeusService>(AmadeusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFlightOffers', () => {
    it('should return flight offers', async () => {
      const result = { data: [{ id: '1', price: 100 }] };
      jest.spyOn(amadeusService, 'getFlightOffers').mockResolvedValue(result);

      const query: SearchFlightDto = {
        originLocationCode: 'SYD',
        destinationLocationCode: 'BKK',
        departureDate: '2024-07-16',
        returnDate: '2024-07-30',
        adults: 2,
        children: 1,
        maxPrice: 1000,
        max: 5,
        currencyCode: 'USD',
      };

      expect(await controller.getFlightOffers(query)).toBe(result);
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(amadeusService, 'getFlightOffers')
        .mockRejectedValue(new Error('An error occurred'));

      const query: SearchFlightDto = {
        originLocationCode: 'SYD',
        destinationLocationCode: 'BKK',
        departureDate: '2024-07-16',
        returnDate: '2024-07-30',
        adults: 2,
        children: 1,
        maxPrice: 1000,
        max: 5,
        currencyCode: 'USD',
      };

      await expect(controller.getFlightOffers(query)).rejects.toThrow(
        'An error occurred',
      );
    });
  });

  // Add more tests for other methods
});
