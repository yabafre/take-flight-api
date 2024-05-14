// amadeus.d.ts

declare module 'amadeus' {
  interface AmadeusOptions {
    clientId: string;
    clientSecret: string;
  }

  export default class Amadeus {
    static location: any | string;
    referenceData: {
      locations: {
        get: (params: any) => Promise<any>;
        cities: {
          get: (params: any) => Promise<any>;
        };
        pointsOfInterest: {
          get: (params: any) => Promise<any>;
          bySquare: (params: any) => Promise<any>;
        };
        airports: {
          get: (params: any) => Promise<any>;
        };
        hotels: {
          get: (params: any) => Promise<any>;
          byCity: {
            get: (params: any) => Promise<any>;
          };
          byGeocode: {
            get: (params: any) => Promise<any>;
          };
          byHotels: {
            get: (params: any) => Promise<any>;
          };
        };
      };
      urls: {
        checkinLinks: {
          get: (params: any) => Promise<any>;
        };
      };
      airlines: {
        get: (params: any) => Promise<any>;
      };
    };
    shopping: {
      flightOffersSearch: {
        get: (params: any) => Promise<any>;
        post: (body: any) => Promise<any>;
      };
      flightOffers: {
        pricing: {
          post: (body: any) => Promise<any>;
        };
        prediction: {
          post: (body: any) => Promise<any>;
        };
        upselling: {
          post: (body: any) => Promise<any>;
        };
      };
      flightDestinations: {
        get: (params: any) => Promise<any>;
      };
      flightDates: {
        get: (params: any) => Promise<any>;
      };
      flightOrders: {
        post: (body: any) => Promise<any>;
      };
      flightOrder: (orderId: string) => {
        get: () => Promise<any>;
        delete: () => Promise<any>;
      };
      seatmaps: {
        post: (body: any) => Promise<any>;
        get: (params: any) => Promise<any>;
      };
      HotelOfferSearch: (offerId: string) => {
        get: () => Promise<any>;
      };
      hotelBookings: {
        post: (params: any) => Promise<any>;
      };
      hotelOffersByCity: {
        get: (params: any) => Promise<any>;
      };
      hotelOffer: (offerId: string) => {
        get: () => Promise<any>;
      };
      hotelOffers: {
        get: (params: any) => Promise<any>;
      };
      hotelOffersSearch: {
        get: (params: any) => Promise<any>;
      };
      hotelOffersByHotel: {
        get: (params: any) => Promise<any>;
      };
    };
    analytics: {
      itineraryPriceMetrics: {
        get: (params: any) => Promise<any>;
      };
    };
    booking: {
      flightOrders: {
        post: (body: any) => Promise<any>;
      };
      hotelBookings: {
        post: (body: any) => Promise<any>;
      };
      flightOrder(orderId: string): any;
    };
    schedule: {
      flights: {
        get: (params: any) => Promise<any>;
      };
    };
    traveler: {
      seatmaps: {
        post: (body: any) => Promise<any>;
      };
    };
    urls: any;

    constructor(options: AmadeusOptions);
  }
}
