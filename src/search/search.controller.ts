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
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly amadeusService: AmadeusService,
    private readonly assistantService: AssistantService,
  ) {}

  @Post('assistant')
  async askAssistant(@Body() requestBody: any) {
    try {
      const response = await this.assistantService.filterResults(requestBody);
      console.log(response);
      return response;
    } catch (error) {
      const message =
        error.description || 'An error occurred while asking the assistant';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('locations')
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('locations/autocomplete')
  async getSkyScrapperAutocompleteLocation(@Query('query') query: string) {
    try {
      const response =
        await this.amadeusService.skyScrapperAutocompleteLocation(query);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred while fetching autocomplete locations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('location/city')
  async getLocationsByCityWord(@Query('cityName') cityName: string) {
    try {
      const response =
        await this.amadeusService.getLocationsByCityWord(cityName);
      return response.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching city locations';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('hotels')
  async getHotelOffersByCity(@Query('cityCode') cityCode: string) {
    try {
      const res = await this.amadeusService.listHotelsByCity(cityCode);
      return res.data;
    } catch (error) {
      const message =
        error.description || 'An error occurred while fetching hotel offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offers')
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offers-by-hotel')
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('hotels/offer')
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('flight-offers')
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    new ZodValidationPipe(),
  )
  @ApiCreatedResponse({
    description: 'The flight offers have been successfully fetched.',
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Post('flight-offers/pricing')
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
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Post('complex-flight-offers')
  async searchComplexFlightOffers(@Body() requestBody: any) {
    try {
      const response =
        await this.amadeusService.searchComplexFlightOffers(requestBody);
      return response.data;
    } catch (error) {
      const message =
        error.description ||
        'An error occurred while searching for complex flight offers';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('flight-inspirations')
  async getFlightInspirations(@Query('origin') origin: string) {
    try {
      const response = await this.amadeusService.getFlightInspirations(origin);
      return response.data;
    } catch (error) {
      const message =
        error.description ||
        'An error occurred while fetching flight inspirations';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('cheapest-flights')
  async getCheapestFlightDates(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    try {
      const response = await this.amadeusService.getCheapestFlightDates(
        origin,
        destination,
      );
      return response.data;
    } catch (error) {
      const message =
        error.description ||
        'An error occurred while fetching the cheapest flight dates';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get('points-of-interest')
  async getPointsOfInterest(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    try {
      const response = await this.amadeusService.getPointsOfInterest(
        latitude,
        longitude,
      );
      return response.data;
    } catch (error) {
      const message =
        error.description ||
        'An error occurred while fetching points of interest';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }
}
