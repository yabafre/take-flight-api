import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { Client } from '@googlemaps/google-maps-services-js';
import OpenAI from 'openai';

interface Criteria {
  maxPrice: number;
  flexibleMaxPrice: boolean;
  originLocationCode: string;
  numberOfPeople: number;
  adults: number;
  children: number;
  destinationLocation: boolean;
  destinationLocationCode?: string;
  continent?: string;
  startDate: string;
  endDate: string;
  travelType: string;
  travelGenre: string;
  activityPace: string;
  keywords: string;
}

@Injectable()
export class AssistantService {
  public thread: any;
  private readonly openai: OpenAI;
  private readonly amadeusService: AmadeusService;
  private readonly googleMapsClient: Client;
  private readonly googleApiKey: string;

  constructor(configService: ConfigService, amadeusService: AmadeusService) {
    this.openai = new OpenAI({
      apiKey: configService.get<string>('NEST_PUBLIC_OPENAI_API_KEY'),
    });
    this.amadeusService = amadeusService;
    this.googleMapsClient = new Client({});
    this.googleApiKey = configService.get<string>(
      'NEST_PUBLIC_GOOGLE_MAPS_API_KEY',
    );
  }

  async threadConversation() {
    try {
      return await this.openai.beta.threads.create();
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  }

  async filterResults(criteria: Criteria) {
    try {
      const { flightBudget, hotelBudget } =
        this.calculateBudgetPerService(criteria);

      if (criteria.destinationLocation) {
        const [flights, hotels] = await Promise.all([
          this.searchFlights(criteria),
          this.searchHotels(criteria),
        ]);

        const [filteredFlights, filteredHotels] = await Promise.all([
          this.filterFlightsWithAI(flights, {
            ...criteria,
            maxPrice: flightBudget,
          }),
          this.filterHotelsWithAI(hotels, {
            ...criteria,
            maxPrice: hotelBudget,
          }),
        ]);

        const coordinates = await this.getCoordinatesFromLocationCode(
          criteria.destinationLocationCode,
        );
        const activities = await this.searchActivitiesWithKeywords(
          criteria,
          coordinates,
        );
        const filteredActivities = await this.filterActivitiesWithAI(
          activities,
          criteria,
        );

        return {
          flights: filteredFlights,
          hotels: filteredHotels,
          activities: filteredActivities,
        };
      } else {
        const suggestedDestinations = await this.suggestDestinations(criteria);
        return await Promise.all(
          suggestedDestinations.map(
            async (destination: { code: string; name: any }) => {
              const updatedCriteria = {
                ...criteria,
                destinationLocationCode: destination.code,
              };
              const [flights, hotels] = await Promise.all([
                this.searchFlights(updatedCriteria),
                this.searchHotels(updatedCriteria),
              ]);

              const [filteredFlights, filteredHotels] = await Promise.all([
                this.filterFlightsWithAI(flights, {
                  ...updatedCriteria,
                  maxPrice: flightBudget,
                }),
                this.filterHotelsWithAI(hotels, {
                  ...updatedCriteria,
                  maxPrice: hotelBudget,
                }),
              ]);

              const coordinates = await this.getCoordinatesFromLocationCode(
                destination.code,
              );
              const activities = await this.searchActivitiesWithKeywords(
                updatedCriteria,
                coordinates,
              );
              const filteredActivities = await this.filterActivitiesWithAI(
                activities,
                updatedCriteria,
              );

              return {
                destination: destination.name,
                flights: filteredFlights,
                hotels: filteredHotels,
                activities: filteredActivities,
              };
            },
          ),
        );
      }
    } catch (error) {
      console.error('Error filtering results:', error);
      throw new Error('Failed to filter results');
    }
  }

  async suggestDestinations(criteria: Criteria) {
    const prompt = `Suggest two destinations in ${criteria.continent} based on the following criteria: ${JSON.stringify(criteria)}`;
    const assistant = await this.openai.beta.assistants.create({
      name: 'destination-suggestion',
      instructions:
        'You are a travel assistant. Please suggest two destinations based on the given criteria.',
      model: 'gpt-4o',
    });

    const threadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'user',
      content: prompt,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      assistant_id: assistant.id,
      instructions: 'Suggest two destinations based on the given criteria.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      const destinations = JSON.parse(
        response.data[0].content as unknown as string,
      );
      return destinations.map((destination) => ({
        name: destination.name,
        code: destination.code,
      }));
    } else {
      return [];
    }
  }

  async searchFlights(criteria: Criteria) {
    const responses = await this.amadeusService.searchFlights({
      originLocationCode: criteria.originLocationCode,
      destinationLocationCode: criteria.destinationLocationCode,
      departureDate: criteria.startDate,
      returnDate: criteria.endDate,
      adults: criteria.adults,
      children: criteria.children,
    });

    // retourner tout les vols
    return responses.map((flightData) => {
      return {
        type: flightData.type,
        id: flightData.id,
        oneWay: flightData.oneWay,
        nonHomogeneous: flightData.nonHomogeneous,
        numberOfBookableSeats: flightData.numberOfBookableSeats,
        itineraries: flightData.itineraries,
        price: flightData.price,
        pricingOptions: flightData.pricingOptions,
        travelerPricings: flightData.travelerPricings,
      };
    });
  }

  async searchHotels(criteria: Criteria) {
    const response = await this.amadeusService.searchHotels({
      destination: criteria.destinationLocationCode,
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      numberOfPeople: criteria.numberOfPeople,
    });

    console.log('response', response[0]);

    return response;
  }

  async filterFlightsWithAI(flights: any[], criteria: any) {
    const prompt = `Filtre les vols suivants en fonction des critères: ${JSON.stringify(criteria)}. Vols: ${JSON.stringify(flights)}`;
    const assistant = await this.openai.beta.assistants.create({
      name: 'flight-filtering',
      instructions:
        'You are a flight booking assistant. Please filter the flights based on the given criteria.',
      model: 'gpt-4o',
    });

    const threadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'user',
      content: prompt,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      assistant_id: assistant.id,
      instructions: 'Filter the flights based on the given criteria.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      const messageContent = response.data[0].content;

      try {
        return JSON.parse(JSON.stringify(messageContent));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response from AI assistant');
      }
    } else {
      return run.status;
    }
  }

  async filterHotelsWithAI(hotels: any[], criteria: any) {
    const prompt = `Filtre les hôtels suivants en fonction des critères: ${JSON.stringify(criteria)}. Hôtels: ${JSON.stringify(hotels)}`;
    const assistant = await this.openai.beta.assistants.create({
      name: 'hotel-filtering',
      instructions:
        'You are a hotel booking assistant. Please filter the hotels based on the given criteria.',
      model: 'gpt-4o',
    });

    const threadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'user',
      content: prompt,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      assistant_id: assistant.id,
      instructions: 'Filter the hotels based on the given criteria.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      const messageContent = response.data[0].content;

      try {
        return JSON.parse(JSON.stringify(messageContent));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response from AI assistant');
      }
    } else {
      return run.status;
    }
  }

  async filterActivitiesWithAI(activities: any[], criteria: any) {
    const prompt = `Filtre les activités suivantes en fonction des critères: ${JSON.stringify(criteria)}. Activités: ${JSON.stringify(activities)}`;
    const assistant = await this.openai.beta.assistants.create({
      name: 'activity-filtering',
      instructions:
        'You are an activity booking assistant. Please filter the activities based on the given criteria.',
      model: 'gpt-4o',
    });

    const threadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'user',
      content: prompt,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      assistant_id: assistant.id,
      instructions: 'Filter the activities based on the given criteria.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      const messageContent = response.data[0].content;

      console.log('messageContent', JSON.parse(JSON.stringify(messageContent)));

      try {
        return JSON.parse(JSON.stringify(messageContent));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response from AI assistant');
      }
    } else {
      return run.status;
    }
  }

  async searchActivitiesWithKeywords(
    criteria: Criteria,
    coordinates: { lat: number; lng: number },
  ) {
    const { keywords } = criteria;

    try {
      const response = await this.googleMapsClient.placesNearby({
        params: {
          location: coordinates,
          radius: 5000, // Rayon de 5 km
          keyword: keywords,
          key: this.googleApiKey,
        },
        timeout: 10000,
      });

      return response.data.results.map((result) => ({
        id: this.generateUniqueId(),
        name: result.name,
        location: result.vicinity,
        description: result.name,
        link: result.place_id, // Place ID pour plus de détails
        category: this.mapCategory(result.types.join(',')), // Mapper la catégorie à partir des types
        price: 0, // Valeur par défaut, peut être affinée
        currency: 'USD', // Valeur par défaut, peut être affinée
        duration: '1 hour', // Valeur par défaut, peut être affinée
      }));
    } catch (error) {
      console.error('Error searching activities with keywords:', error);
      throw new Error('Failed to search activities');
    }
  }

  async createItinerary(hotelLocation: string, activities, criteria) {
    try {
      const itinerary = await this.planItineraryWithAI(
        hotelLocation,
        activities,
        criteria,
      );
      return itinerary;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw new Error('Failed to create itinerary');
    }
  }

  async planItineraryWithAI(hotelLocation: string, activities, criteria) {
    const prompt = `Planifie un itinéraire basé sur les critères suivants: ${JSON.stringify(criteria)} et les activités: ${JSON.stringify(activities)}. Point de départ: ${hotelLocation}`;
    const assistant = await this.openai.beta.assistants.create({
      name: 'itinerary-planning',
      instructions:
        'You are an itinerary planning assistant. Please plan an itinerary based on the given criteria and activities.',
      model: 'gpt-4o',
    });

    const threadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'user',
      content: prompt,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      assistant_id: assistant.id,
      instructions:
        'Plan the itinerary based on the given criteria and activities.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      return JSON.parse(response.data[0].content as unknown as string);
    } else {
      return run.status;
    }
  }

  async getCoordinatesFromLocationCode(locationCode: string) {
    // Table de correspondance des codes IATA aux noms complets de ville
    const iataToCity = {
      TYO: 'Tokyo',
      PAR: 'Paris',
      NYC: 'New York',
      LON: 'London',
      // Ajouter d'autres codes IATA ici
    };

    const cityName = iataToCity[locationCode];
    if (!cityName) {
      console.error(`No city name found for location code: ${locationCode}`);
      throw new Error('Invalid location code');
    }

    try {
      console.log(`Fetching coordinates for city: ${cityName}`);
      const response = await this.googleMapsClient.geocode({
        params: {
          address: cityName,
          key: this.googleApiKey,
        },
      });
      console.log(
        'Location response:',
        JSON.stringify(response.data.results[0]),
      );
      if (
        !response.data ||
        !response.data.results ||
        response.data.results.length === 0
      ) {
        console.error('No coordinates found in the response:', response);
        throw new Error('No coordinates found for the given city name');
      }

      const location = response.data.results[0].geometry.location;
      const coordinates = {
        lat: location.lat,
        lng: location.lng,
      };

      console.log('Coordinates found:', coordinates);
      return coordinates;
    } catch (error) {
      console.error('Error getting coordinates from city name:', error);
      throw new Error('Failed to get coordinates');
    }
  }

  // Fonction pour générer un ID unique
  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Fonction pour mapper les catégories aux valeurs autorisées
  mapCategory(
    keyword: string,
  ): 'culturelle' | 'plein air' | 'gastronomie' | 'shopping' {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword.includes('culture')) return 'culturelle';
    if (lowerKeyword.includes('outdoor') || lowerKeyword.includes('plein air'))
      return 'plein air';
    if (lowerKeyword.includes('food') || lowerKeyword.includes('gastronomy'))
      return 'gastronomie';
    if (lowerKeyword.includes('shopping')) return 'shopping';
    return 'culturelle'; // Valeur par défaut
  }

  private calculateBudgetPerService(criteria: Criteria): {
    flightBudget: number;
    hotelBudget: number;
  } {
    const totalBudget = criteria.maxPrice;
    // On peut décider d'une répartition, par exemple 60% pour les vols et 40% pour les hôtels
    const flightBudget = totalBudget * 0.6;
    const hotelBudget = totalBudget * 0.4;
    return { flightBudget, hotelBudget };
  }
}
