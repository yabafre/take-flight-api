import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import Amadeus from 'amadeus';

@Injectable()
export class AmadeusService {
  private readonly amadeusClient: Amadeus;
  private readonly skyScrapperClient: any;
  private readonly axiosConfig: AxiosRequestConfig;

  constructor(configService: ConfigService) {
    this.amadeusClient = new Amadeus({
      clientId: configService.get<string>('NEST_PUBLIC_AMADEUS_API_KEY'),
      clientSecret: configService.get<string>('NEST_PUBLIC_AMADEUS_API_SECRET'),
    });

    this.skyScrapperClient = axios.create({
      baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v1',
    });
    this.axiosConfig = {
      headers: {
        'X-RapidAPI-Key': configService.get<string>(
          'NEST_PUBLIC_RAPID_API_KEY',
        ),
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      } as RawAxiosRequestHeaders,
    };
  }

  // Get a list of airports and cities based on a search term with SkyScrapper
  async skyScrapperAutocompleteLocation(query: string): Promise<any> {
    return this.skyScrapperClient.get(`/flights/searchAirport`, {
      ...this.axiosConfig,
      params: {
        query: query,
      },
    });
  }

  // Suggest locations based on a search term with Amadeus
  async amadeusAutocompleteLocation(body: any): Promise<any> {
    return this.amadeusClient.referenceData.locations.get({
      keyword: body.keyword,
      subType:
        body.subType === 'CITY'
          ? Amadeus.location.city
          : body.subType === 'AIRPORT'
            ? Amadeus.location.airport
            : Amadeus.location.any,
    });
  }

  // finds cities that match a specific word or string of letters.
  async getLocationsByCityWord(cityName: string): Promise<any> {
    return this.amadeusClient.referenceData.locations.cities.get({
      keyword: cityName,
    });
  }

  // Get a list of hotels in a specific city
  async getHotelOffersByCityCode(cityCode: string): Promise<any> {
    return this.amadeusClient.shopping.hotelOffers.get({
      cityCode: cityCode,
    });
  }

  // get list of hotels by city code
  async listHotelsByCity(cityCode: string) {
    return this.amadeusClient.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode,
    });
  }

  // Get a list of hotel offers based on city, check-in date, number of adults, and number of rooms
  async getHotelOffers(
    city: string,
    checkInDate: string,
    adults: number,
    roomQuantity: number,
  ): Promise<any> {
    return this.amadeusClient.shopping.hotelOffersSearch.get({
      cityCode: city,
      checkInDate: checkInDate,
      adults: adults,
      roomQuantity: roomQuantity,
    });
  }

  // Get a list of offers for a specific hotel
  async getHotelOffersByHotelId(hotelId: string): Promise<any> {
    return this.amadeusClient.shopping.hotelOffersByHotel.get({
      hotelId: hotelId,
    });
  }

  // Get confirmed hotel offer details
  async getHotelOfferByOfferId(offerId: string): Promise<any> {
    return this.amadeusClient.shopping.hotelOffer(offerId).get();
  }

  // Post a booking a hotel offer
  async postHotelOfferBooking(
    offerId: string,
    guests: any[],
    payments: any[],
  ): Promise<any> {
    return this.amadeusClient.booking.hotelBookings.post({
      data: {
        offerId: offerId,
        guests: guests,
        payments: payments,
      },
    });
  }

  // search for flight offers
  async getFlightOffers(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number,
  ) {
    return this.amadeusClient.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
    });
  }

  // get flight destinations for inspiration
  async getFlightInspirations(origin: string) {
    return this.amadeusClient.shopping.flightDestinations.get({
      origin: origin,
    });
  }

  // search for flight offers with more complex queries
  async searchComplexFlightOffers(requestBody: any) {
    return this.amadeusClient.shopping.flightOffersSearch.post(
      JSON.stringify(requestBody),
    );
  }

  // predict the best flight offers
  async predictFlightOffers(flightOffers: any) {
    return this.amadeusClient.shopping.flightOffers.prediction.post(
      JSON.stringify(flightOffers),
    );
  }

  // confirm flight offer pricing
  async confirmFlightOfferPricing(offers: any) {
    return this.amadeusClient.shopping.flightOffers.pricing.post({
      data: {
        type: 'flight-offers-pricing',
        flightOffers: offers,
      },
    });
  }

  // create flight order
  async createFlightOrder(flightOffers: any[], travelers: any[]): Promise<any> {
    return this.amadeusClient.booking.flightOrders.post({
      data: {
        type: 'flight-order',
        flightOffers: flightOffers,
        travelers: travelers,
      },
    });
  }

  // get flight order details
  async getFlightOrderDetails(orderId: string): Promise<any> {
    return this.amadeusClient.booking.flightOrder(orderId).get();
  }

  // delete a flight order
  async deleteFlightOrder(orderId: string): Promise<any> {
    return this.amadeusClient.booking.flightOrder(orderId).delete();
  }

  // get flight check-in links
  async getFlightCheckinLinks(airlineCode: any): Promise<any> {
    return this.amadeusClient.urls.checkinLinks.get({
      airlineCode: airlineCode,
    });
  }

  // find the cheapest flight dates
  async getCheapestFlightDates(origin: string, destination: string) {
    return this.amadeusClient.shopping.flightDates.get({
      origin: origin,
      destination: destination,
    });
  }

  // Retrieve points of interest based on geographical coordinates
  async getPointsOfInterest(latitude: number, longitude: number): Promise<any> {
    return this.amadeusClient.referenceData.locations.pointsOfInterest.get({
      latitude: latitude,
      longitude: longitude,
    });
  }
}
