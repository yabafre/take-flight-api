import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { AssistantService } from '@/assistant/assistant.service';
import { SearchFlightDto } from '@/search/dto/search-flight.dto';
import { assistantCriteriaDto } from '@/search/dto/search-assistant-criteria.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  FlightOffersExample,
  FlightOffersPricingExample,
  HotelOffersPricingExample,
} from '@/search/swagger/schema';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly amadeusService: AmadeusService,
    private readonly assistantService: AssistantService,
  ) {}

  @Post('assistant')
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    new ZodValidationPipe(),
  )
  @ApiOperation({ summary: 'Ask assistant for travel suggestions' })
  @ApiBody({
    description: 'Request body for assistant',
    schema: {
      example: {
        maxPrice: 2000,
        flexibleMaxPrice: false,
        originLocationCode: "PAR",
        numberOfPeople: 3,
        adults: 3,
        children: 0,
        destinationLocation: true,
        destinationLocationCode: "TYO",
        startDate: "2024-07-11",
        endDate: "2024-07-28",
        travelType: "culturel",
        travelGenre: "",
        activityPace: "calme",
        keywords: "Plage"
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Assistant response',
    schema: {
      example: {
        suggestions: [
          { suggestion: 'Visit the Eiffel Tower', location: 'Paris' },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while asking the assistant',
  })
  async askAssistant(@Body() requestBody: assistantCriteriaDto) {
    try {
      const response = await this.assistantService.filterResults(requestBody);
      return response;
    } catch (error) {
      console.log(error);
      const message =
        error.description || 'An error occurred while asking the assistant';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Get('locations')
  @ApiOperation({
    summary: 'Get autocomplete location suggestions from Amadeus',
  })
  @ApiQuery({ name: 'keyword', description: 'Keyword for location search' })
  @ApiResponse({
    status: 200,
    description: 'Location suggestions',
    schema: { example: { data: [{ id: 'PAR', name: 'Paris' }] } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid keyword provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching locations',
  })
  async getAmadeusAutocompleteLocation(@Query('keyword') keyword: string) {
    try {
      const response =
        await this.amadeusService.amadeusAutocompleteLocation(keyword);
      return response.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching locations';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Get('locations/autocomplete')
  @ApiOperation({
    summary: 'Get autocomplete location suggestions from SkyScrapper',
  })
  @ApiQuery({ name: 'query', description: 'Query for location search' })
  @ApiResponse({
    status: 200,
    description: 'Location suggestions',
    schema: { example: { data: [{ id: 'NYC', name: 'New York City' }] } },
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching autocomplete locations',
  })
  async getSkyScrapperAutocompleteLocation(@Query('query') query: string) {
    try {
      const response =
        await this.amadeusService.skyScrapperAutocompleteLocation(query);
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching autocomplete locations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('hotels')
  @ApiOperation({ summary: 'Get hotel offers by city' })
  @ApiQuery({ name: 'cityCode', description: 'City code for hotel search' })
  @ApiResponse({
    status: 200,
    description: 'Hotel offers',
    schema: { example: { data: [{ id: 'HOTEL123', name: 'Hotel Example' }] } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid city code provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching hotel offers',
  })
  async getHotelOffersByCity(@Query('cityCode') cityCode: string) {
    try {
      const res = await this.amadeusService.listHotelsByCity(cityCode);
      return res.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching hotel offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offers')
  @ApiOperation({ summary: 'Get hotel offers by various parameters' })
  @ApiQuery({ name: 'city', description: 'City name for hotel search' })
  @ApiQuery({ name: 'checkInDate', description: 'Check-in date' })
  @ApiQuery({ name: 'checkOutDate', description: 'Check-out date' })
  @ApiQuery({ name: 'adults', description: 'Number of adults' })
  @ApiQuery({ name: 'roomQuantity', description: 'Number of rooms' })
  @ApiResponse({
    status: 200,
    description: 'Hotel offers',
    schema: { example: HotelOffersPricingExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid search parameters provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching hotel offers',
  })
  async getHotelOffers(
    @Query('city') city: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
    @Query('adults') adults: number,
    @Query('roomQuantity') roomQuantity: number,
  ) {
    try {
      const response = await this.amadeusService.getHotelOffers(
        city,
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity,
      );
      return response.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching hotel offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offers-by-hotel')
  @ApiOperation({ summary: 'Get hotel offers by hotel ID' })
  @ApiQuery({ name: 'hotelId', description: 'Hotel ID for offers search' })
  @ApiResponse({
    status: 200,
    description: 'Hotel offers',
    schema: { example: { data: [{ id: 'HOTEL123', name: 'Hotel Example' }] } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid hotel ID provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching hotel offers',
  })
  async getHotelOffersByHotel(@Query('hotelId') hotelId: string) {
    try {
      const response =
        await this.amadeusService.getHotelOffersByHotelId(hotelId);
      return response.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching hotel offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offer')
  @ApiOperation({ summary: 'Get a specific hotel offer by offer ID' })
  @ApiQuery({ name: 'offerId', description: 'Offer ID for hotel offer search' })
  @ApiResponse({
    status: 200,
    description: 'Hotel offer',
    schema: { example: { data: [{ id: 'OFFER123', name: 'Offer Example' }] } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid offer ID provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching the hotel offer',
  })
  async getHotelOffer(@Query('offerId') offerId: string) {
    try {
      const response =
        await this.amadeusService.getHotelOfferByOfferId(offerId);
      return response.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching the hotel offer';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @ApiTags('Search/Flight')
  @Get('flight-offers')
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    new ZodValidationPipe(),
  )
  @ApiOperation({ summary: 'Get flight offers' })
  @ApiResponse({
    status: 200,
    description: 'Flight offers',
    schema: { example: FlightOffersExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid search parameters provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching flight offers',
  })
  async getFlightOffers(@Query() query: SearchFlightDto) {
    try {
      const response = await this.amadeusService.getFlightOffers(query);
      return response.result;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching flight offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  @Post('flight-offers/pricing')
  @ApiOperation({ summary: 'Get flight offers pricing' })
  @ApiBody({
    description: 'Request body for flight offers pricing',
    schema: {
      example: {
        flightOfferIds: ['1', '2', '3'],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Flight offers pricing',
    schema: { example: FlightOffersPricingExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid flight offer IDs provided',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching flight offers pricing',
  })
  async getFlightOffersPrices(@Body() requestBody: any) {
    try {
      const response =
        await this.amadeusService.getFlightOffersPricing(requestBody);
      return response.data;
    } catch (error) {
      const message =
        error.description ||
        'An error occurred while fetching flight offers pricing';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }
}
