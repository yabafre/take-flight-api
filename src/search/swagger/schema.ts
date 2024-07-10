// src/swagger/schemas.ts

export const FlightOffersExample = {
  meta: {
    count: 5,
    links: {
      self: 'https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&adults=2&max=5&departureDate=2024-07-16&returnDate=2024-07-30',
    },
  },
  data: [
    {
      type: 'flight-offer',
      id: '1',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: '2024-07-16',
      lastTicketingDateTime: '2024-07-16',
      numberOfBookableSeats: 3,
      itineraries: [
        {
          duration: 'PT14H15M',
          segments: [
            {
              departure: {
                iataCode: 'SYD',
                terminal: '1',
                at: '2024-07-16T11:35:00',
              },
              arrival: {
                iataCode: 'MNL',
                terminal: '1',
                at: '2024-07-16T16:50:00',
              },
              carrierCode: 'PR',
              number: '212',
              aircraft: {
                code: '333',
              },
              operating: {
                carrierCode: 'PR',
              },
              duration: 'PT8H15M',
              id: '5',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: 'MNL',
                terminal: '1',
                at: '2024-07-16T19:20:00',
              },
              arrival: {
                iataCode: 'BKK',
                at: '2024-07-16T21:50:00',
              },
              carrierCode: 'PR',
              number: '732',
              aircraft: {
                code: '321',
              },
              operating: {
                carrierCode: 'PR',
              },
              duration: 'PT3H30M',
              id: '6',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: 'PT16H15M',
          segments: [
            {
              departure: {
                iataCode: 'BKK',
                at: '2024-07-30T13:30:00',
              },
              arrival: {
                iataCode: 'MNL',
                terminal: '1',
                at: '2024-07-30T18:00:00',
              },
              carrierCode: 'PR',
              number: '731',
              aircraft: {
                code: '333',
              },
              operating: {
                carrierCode: 'PR',
              },
              duration: 'PT3H30M',
              id: '9',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: 'MNL',
                terminal: '1',
                at: '2024-07-30T22:10:00',
              },
              arrival: {
                iataCode: 'SYD',
                terminal: '1',
                at: '2024-07-31T09:45:00',
              },
              carrierCode: 'PR',
              number: '211',
              aircraft: {
                code: '333',
              },
              operating: {
                carrierCode: 'PR',
              },
              duration: 'PT8H35M',
              id: '10',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: 'EUR',
        total: '1002.64',
        base: '606.00',
        fees: [
          {
            amount: '0.00',
            type: 'SUPPLIER',
          },
          {
            amount: '0.00',
            type: 'TICKETING',
          },
        ],
        grandTotal: '1002.64',
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBagsOnly: true,
      },
      validatingAirlineCodes: ['PR'],
      travelerPricings: [
        {
          travelerId: '1',
          fareOption: 'STANDARD',
          travelerType: 'ADULT',
          price: {
            currency: 'EUR',
            total: '501.32',
            base: '303.00',
          },
          fareDetailsBySegment: [
            {
              segmentId: '5',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '6',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '9',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '10',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
          ],
        },
        {
          travelerId: '2',
          fareOption: 'STANDARD',
          travelerType: 'ADULT',
          price: {
            currency: 'EUR',
            total: '501.32',
            base: '303.00',
          },
          fareDetailsBySegment: [
            {
              segmentId: '5',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '6',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '9',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
            {
              segmentId: '10',
              cabin: 'ECONOMY',
              fareBasis: 'TBAU',
              class: 'T',
              includedCheckedBags: {
                weight: 30,
                weightUnit: 'KG',
              },
            },
          ],
        },
      ],
    },
  ],
  dictionaries: {
    locations: {
      BKK: {
        cityCode: 'BKK',
        countryCode: 'TH',
      },
      SIN: {
        cityCode: 'SIN',
        countryCode: 'SG',
      },
      MNL: {
        cityCode: 'MNL',
        countryCode: 'PH',
      },
      SYD: {
        cityCode: 'SYD',
        countryCode: 'AU',
      },
    },
    aircraft: {
      '321': 'AIRBUS A321',
      '333': 'AIRBUS A330-300',
      '789': 'BOEING 787-9',
      '32Q': 'AIRBUS A321NEO',
    },
    currencies: {
      EUR: 'EURO',
    },
    carriers: {
      PR: 'PHILIPPINE AIRLINES',
      TR: 'SCOOT',
    },
  },
};

export const FlightOffersPricingExample = {
  data: [
    {
      type: 'flight-offer-pricing',
      flightOffers: [
        {
          type: 'flight-offer',
          id: '1',
          source: 'GDS',
          instantTicketingRequired: false,
          nonHomogeneous: false,
          oneWay: false,
          lastTicketingDate: '2024-07-16',
          numberOfBookableSeats: 3,
          itineraries: [
            {
              duration: 'PT14H15M',
              segments: [
                {
                  departure: {
                    iataCode: 'SYD',
                    terminal: '1',
                    at: '2024-07-16T11:35:00',
                  },
                  arrival: {
                    iataCode: 'MNL',
                    terminal: '1',
                    at: '2024-07-16T16:50:00',
                  },
                  carrierCode: 'PR',
                  number: '212',
                  aircraft: {
                    code: '333',
                  },
                  operating: {
                    carrierCode: 'PR',
                  },
                  duration: 'PT8H15M',
                  id: '5',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
                {
                  departure: {
                    iataCode: 'MNL',
                    terminal: '1',
                    at: '2024-07-16T19:20:00',
                  },
                  arrival: {
                    iataCode: 'BKK',
                    at: '2024-07-16T21:50:00',
                  },
                  carrierCode: 'PR',
                  number: '732',
                  aircraft: {
                    code: '321',
                  },
                  operating: {
                    carrierCode: 'PR',
                  },
                  duration: 'PT3H30M',
                  id: '6',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
              ],
            },
            {
              duration: 'PT16H15M',
              segments: [
                {
                  departure: {
                    iataCode: 'BKK',
                    at: '2024-07-30T13:30:00',
                  },
                  arrival: {
                    iataCode: 'MNL',
                    terminal: '1',
                    at: '2024-07-30T18:00:00',
                  },
                  carrierCode: 'PR',
                  number: '731',
                  aircraft: {
                    code: '333',
                  },
                  operating: {
                    carrierCode: 'PR',
                  },
                  duration: 'PT3H30M',
                  id: '9',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
                {
                  departure: {
                    iataCode: 'MNL',
                    terminal: '1',
                    at: '2024-07-30T22:10:00',
                  },
                  arrival: {
                    iataCode: 'SYD',
                    terminal: '1',
                    at: '2024-07-31T09:45:00',
                  },
                  carrierCode: 'PR',
                  number: '211',
                  aircraft: {
                    code: '333',
                  },
                  operating: {
                    carrierCode: 'PR',
                  },
                  duration: 'PT8H35M',
                  id: '10',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
              ],
            },
          ],
          price: {
            currency: 'EUR',
            total: '1002.64',
            base: '606.00',
            fees: [
              {
                amount: '0.00',
                type: 'SUPPLIER',
              },
              {
                amount: '0.00',
                type: 'TICKETING',
              },
            ],
            grandTotal: '1002.64',
          },
          pricingOptions: {
            fareType: ['PUBLISHED'],
            includedCheckedBagsOnly: true,
          },
          validatingAirlineCodes: ['PR'],
          travelerPricings: [
            {
              travelerId: '1',
              fareOption: 'STANDARD',
              travelerType: 'ADULT',
              price: {
                currency: 'EUR',
                total: '501.32',
                base: '303.00',
              },
              fareDetailsBySegment: [
                {
                  segmentId: '5',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '6',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '9',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '10',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
              ],
            },
            {
              travelerId: '2',
              fareOption: 'STANDARD',
              travelerType: 'ADULT',
              price: {
                currency: 'EUR',
                total: '501.32',
                base: '303.00',
              },
              fareDetailsBySegment: [
                {
                  segmentId: '5',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '6',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '9',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
                {
                  segmentId: '10',
                  cabin: 'ECONOMY',
                  fareBasis: 'TBAU',
                  class: 'T',
                  includedCheckedBags: {
                    weight: 30,
                    weightUnit: 'KG',
                  },
                },
              ],
            },
          ],
        },
      ],
      bookingRequirements: {
        travelAgencyNecessary: false,
        paymentType: 'CREDIT',
      },
    },
  ],
};

export const SearchAutocompleteExample = {
  data: [
    {
      type: 'location',
      subType: 'CITY',
      name: 'Bangkok',
      detailedName: 'Bangkok, Thailand',
      id: 'BKK',
      self: {
        href: 'https://test.api.amadeus.com/v1/reference-data/locations/BKK',
      },
    },
    {
      type: 'location',
      subType: 'CITY',
      name: 'Sydney',
      detailedName: 'Sydney, Australia',
      id: 'SYD',
      self: {
        href: 'https://test.api.amadeus.com/v1/reference-data/locations/SYD',
      },
    },
    {
      type: 'location',
      subType: 'CITY',
      name: 'Manila',
      detailedName: 'Manila, Philippines',
      id: 'MNL',
      self: {
        href: 'https://test.api.amadeus.com/v1/reference-data/locations/MNL',
      },
    },
  ],
};

export const HotelOffersExample = {
  meta: {
    count: 5,
    links: {
      self: 'https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=PAR&adults=1&radius=5&radiusUnit=KM&paymentPolicy=NONE&includeClosed=false&bestRateOnly=true&view=FULL',
    },
  },
  data: [
    {
      type: 'hotel-offer',
      hotel: {
        type: 'hotel',
        hotelId: 'BGLONBGB',
        chainCode: 'BG',
        dupeId: '700048620',
        name: 'HOTEL BLOOM!',
        rating: '4',
        cityCode: 'BRU',
        latitude: 50.86056,
        longitude: 4.36711,
        hotelDistance: {
          distance: 1.5,
          distanceUnit: 'KM',
        },
        address: {
          lines: ['RUE ROYALE 250'],
          postalCode: '1210',
          cityName: 'BRUSSELS',
          countryCode: 'BE',
        },
        contact: {
          phone: '+32 2 2206666',
          fax: '+32 2 2206667',
          email: 'mail@exemple.com',
        },
        description: {
          lang: 'en',
          text: 'The hotel is located in the city center of Brussels.',
        },
        amenities: [
          'RESTAURANT',
          'BAR',
          'MEETING_ROOMS',
          'FITNESS_CENTER',
          'PARKING',
          'FREE_WIFI',
          'AIR_CONDITIONING',
        ],
        media: [
          {
            uri: 'https://example.com/image.jpg',
            category: 'EXTERIOR',
          },
        ],
      },
      available: true,
      offers: [
        {
          id: '1',
          rateCode: 'BAR',
          rateFamilyEstimated: {
            code: 'BAR',
            type: 'STANDARD_ROOM',
          },
          commission: {
            amount: '0.00',
            percentage: '0.00',
          },
          room: {
            type: 'room',
            typeEstimated: {
              category: 'STANDARD',
              beds: 1,
              bedType: 'QUEEN',
            },
            description: {
              lang: 'en',
              text: 'Room with queen bed',
            },
            amenities: ['SHOWER', 'TOILETRIES', 'TV', 'PHONE'],
          },
          guests: {
            adults: 1,
          },
          price: {
            currency: 'EUR',
            total: '125.00',
            variations: {
              average: {
                base: '125.00',
              },
              changes: [
                {
                  startDate: '2024-07-16',
                  endDate: '2024-07-17',
                  base: '125.00',
                },
              ],
            },
          },
          policies: {
            paymentType: 'NONE',
            cancellation: {
              deadline: '2024-07-15T23:59:00',
              amount: '0.00',
              amountType: 'PENALTY',
            },
          },
        },
      ],
    },
  ],
};

export const HotelOffersPricingExample = {
  data: [
    {
      type: 'hotel-offer-pricing',
      hotelOffers: [
        {
          type: 'hotel-offer',
          hotel: {
            type: 'hotel',
            hotelId: 'BGLONBGB',
            chainCode: 'BG',
            dupeId: '700048620',
            name: 'HOTEL BLOOM!',
            rating: '4',
            cityCode: 'BRU',
            latitude: 50.86056,
            longitude: 4.36711,
            hotelDistance: {
              distance: 1.5,
              distanceUnit: 'KM',
            },
            address: {
              lines: ['RUE ROYALE 250'],
              postalCode: '1210',
              cityName: 'BRUSSELS',
              countryCode: 'BE',
            },
            contact: {
              phone: '+32 2 2206666',
              fax: '+32 2 2206667',
              email: 'mail@exemple.com',
            },
            description: {
              lang: 'en',
              text: 'The hotel is located in the city center of Brussels.',
            },
            amenities: [
              'RESTAURANT',
              'BAR',
              'MEETING_ROOMS',
              'FITNESS_CENTER',
              'PARKING',
              'FREE_WIFI',
              'AIR_CONDITIONING',
            ],
            media: [
              {
                uri: 'https://example.com/image.jpg',
                category: 'EXTERIOR',
              },
            ],
          },
          available: true,
          offers: [
            {
              id: '1',
              rateCode: 'BAR',
              rateFamilyEstimated: {
                code: 'BAR',
                type: 'STANDARD_ROOM',
              },
              commission: {
                amount: '0.00',
                percentage: '0.00',
              },
              room: {
                type: 'room',
                typeEstimated: {
                  category: 'STANDARD',
                  beds: 1,
                  bedType: 'QUEEN',
                },
                description: {
                  lang: 'en',
                  text: 'Room with queen bed',
                },
                amenities: ['SHOWER', 'TOILETRIES', 'TV', 'PHONE'],
              },
              guests: {
                adults: 1,
              },
              price: {
                currency: 'EUR',
                total: '125.00',
                variations: {
                  average: {
                    base: '125.00',
                  },
                  changes: [
                    {
                      startDate: '2024-07-16',
                      endDate: '2024-07-17',
                      base: '125.00',
                    },
                  ],
                },
              },
              policies: {
                paymentType: 'NONE',
                cancellation: {
                  deadline: '2024-07-15T23:59:00',
                  amount: '0.00',
                  amountType: 'PENALTY',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};