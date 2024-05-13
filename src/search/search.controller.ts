import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AmadeusService } from '@/amadeus/amadeus.service';

@Controller('search')
export class SearchController {
  constructor(private readonly amadeusService: AmadeusService) {}

  @Get('locations')
  async getAmadeusAutocompleteLocation(
    @Query('keyword') keyword: string,
    @Query('subType') subType: string,
  ) {
    try {
      const data = {
        keyword,
        subType,
      };
      const response =
        await this.amadeusService.amadeusAutocompleteLocation(data);
      return response.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }

  @Get('locations/autocomplete')
  async getSkyScrapperAutocompleteLocation(@Query('query') query: string) {
    try {
      const response =
        await this.amadeusService.skyScrapperAutocompleteLocation(query);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('location/city')
  async getLocationsByCityWord(@Query('cityName') cityName: string) {
    try {
      const response =
        await this.amadeusService.getLocationsByCityWord(cityName);
      return response.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }

  @Get('hotels')
  async getHotelOffersByCity(@Query('cityCode') cityCode: string) {
    console.log('cityCode', cityCode);
    try {
      const res = await this.amadeusService.listHotelsByCity(cityCode);
      return res.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }

  @Get('flight-offers')
  async getFlightOffers(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('departureDate') departureDate: string,
    @Query('adults') adults: number,
  ) {
    try {
      const response = await this.amadeusService.getFlightOffers(
        origin,
        destination,
        departureDate,
        adults,
      );
      return response.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }

  @Post('complex-flight-offers')
  async searchComplexFlightOffers(@Body() requestBody: any) {
    try {
      const response =
        await this.amadeusService.searchComplexFlightOffers(requestBody);
      return response.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }

  @Get('flight-inspirations')
  async getFlightInspirations(@Query('origin') origin: string) {
    try {
      const response = await this.amadeusService.getFlightInspirations(origin);
      return response.data;
    } catch (error) {
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
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
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
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
      const message = error.description;
      const status = error.response.statusCode;
      console.log(error);
      return new HttpException(message, status);
    }
  }
}
