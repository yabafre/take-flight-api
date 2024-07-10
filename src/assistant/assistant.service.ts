import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { Client } from '@googlemaps/google-maps-services-js';
import OpenAI from 'openai';
import CurrencyConverter from 'currency-converter-lt';
import { MessageContent } from 'openai/resources/beta/threads';
import { assistantCriteriaDto } from '@/search/dto/search-assistant-criteria.dto';

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

  async filterResults(criteria: assistantCriteriaDto) {
    try {
      const { flightBudget, hotelBudget } =
        this.calculateBudgetPerService(criteria);

      if (criteria.destinationLocation) {
        const [flights, hotels] = await Promise.all([
          this.searchFlights(criteria),
          this.searchHotels(criteria),
        ]);

        const filteredFlights = await this.filterFlightsWithAI(flights, {
          ...criteria,
          maxPrice: flightBudget,
        });

        await this.delay(2000); // Ajoute un délai de 2 secondes entre les appels pour respecter la limite TPM

        const filteredHotels = await this.filterHotelsWithAI(hotels, {
          ...criteria,
          maxPrice: hotelBudget,
        });

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
        const results = [];

        for (const destination of suggestedDestinations) {
          const updatedCriteria = {
            ...criteria,
            destinationLocationCode: destination.code,
          };

          const flights = await this.searchFlights(updatedCriteria);
          await this.delay(2000); // Ajoute un délai de 2 secondes entre les appels pour respecter la limite TPM

          const filteredFlights = await this.filterFlightsWithAI(flights, {
            ...updatedCriteria,
            maxPrice: flightBudget,
          });

          await this.delay(2000); // Ajoute un délai de 2 secondes entre les appels pour respecter la limite TPM

          const hotels = await this.searchHotels(updatedCriteria);
          await this.delay(2000); // Ajoute un délai de 2 secondes entre les appels pour respecter la limite TPM

          const filteredHotels = await this.filterHotelsWithAI(hotels, {
            ...updatedCriteria,
            maxPrice: hotelBudget,
          });

          const coordinates = await this.getCoordinatesFromLocationCode(
            destination.code,
          );
          const activities = await this.searchActivitiesWithKeywords(
            updatedCriteria,
            coordinates,
          );

          await this.delay(2000); // Ajoute un délai de 2 secondes entre les appels pour respecter la limite TPM

          const filteredActivities = await this.filterActivitiesWithAI(
            activities,
            updatedCriteria,
          );

          results.push({
            destination: destination.name,
            flights: filteredFlights,
            hotels: filteredHotels,
            activities: filteredActivities,
          });

          await this.delay(2000); // Ajoute un délai de 2 secondes entre chaque itération pour respecter la limite TPM
        }

        return results;
      }
    } catch (error) {
      console.error('Error filtering results:', error);
      throw new Error('Failed to filter results');
    }
  }

  async suggestDestinations(criteria: assistantCriteriaDto) {
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

  async searchFlights(criteria: assistantCriteriaDto) {
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

  async searchHotels(criteria: assistantCriteriaDto) {
    const response = await this.amadeusService.searchHotels({
      destination: criteria.destinationLocationCode,
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      numberOfPeople: criteria.numberOfPeople,
    });

    // Filtrer les hôtels sans chambres disponibles
    const availableHotels = response.filter(
      (hotel) => hotel.offers && hotel.offers.length > 0,
    );

    console.log('Available hotels:', availableHotels.length);

    return availableHotels;
  }

  async filterFlightsWithAI(flights: any[], criteria: any) {
    const chunkSize = 10; // Taille de chaque chunk pour éviter d'avoir une chaîne trop longue
    const filteredFlights = [];

    for (let i = 0; i < flights.length; i += chunkSize) {
      const chunk = flights.slice(i, i + chunkSize);

      const prompt = `Filtre ces vols pour un budget total de ${criteria.maxPrice} EUR, le budget peut-être flexible : ${criteria.flexibleMaxPrice}. Critères: dates (${criteria.startDate} - ${criteria.endDate}), budget alloué aux vols. Vols: ${JSON.stringify(chunk)}`;

      const assistant = await this.openai.beta.assistants.create({
        name: 'flight-filtering',
        instructions:
          'Tu es un assistant de réservation de vols. Filtre les vols selon les critères donnés, en choisissant les trois meilleures options en termes de prix et de durée.',
        model: 'gpt-4o',
      });

      const threadId = await this.threadConversation();
      await this.openai.beta.threads.messages.create(threadId.id, {
        role: 'user',
        content: prompt,
      });

      const run = await this.openai.beta.threads.runs.createAndPoll(
        threadId.id,
        {
          assistant_id: assistant.id,
          instructions:
            'Filtre les vols selon les critères donnés et renvoie les trois meilleures options.',
        },
      );

      if (run.status === 'completed') {
        const response = await this.openai.beta.threads.messages.list(
          run.thread_id,
        );
        const messageContent = response.data[0].content;

        try {
          const chunkFilteredFlights = JSON.parse(
            JSON.stringify(messageContent),
          ).slice(0, 3); // Prendre seulement les trois meilleurs
          filteredFlights.push(...chunkFilteredFlights);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          throw new Error('Failed to parse JSON response from AI assistant');
        }
      } else {
        return run.status;
      }

      await this.delay(3000); // Ajoute un délai de 3 secondes entre chaque requête pour éviter de dépasser la limite TPM
    }

    return filteredFlights;
  }

  async filterHotelsWithAI(hotels: any[], criteria: any) {
    const hotelIds: string[] = [];
    const totalNights =
      (new Date(criteria.endDate).getTime() -
        new Date(criteria.startDate).getTime()) /
      (1000 * 60 * 60 * 24);

    // Convertir les prix des offres d'hôtels en EUR
    const hotelsWithConvertedPrices = await Promise.all(
      hotels.map(async (hotel) => {
        const validOffers = hotel.offers.filter(
          (offer: { price: { total: string; currency: string } }) =>
            offer.price.total && offer.price.currency,
        );

        const convertedOffers = await Promise.all(
          validOffers.map(
            async (offer: { price: { total: string; currency: string } }) => {
              const totalPrice = parseFloat(offer.price.total);
              const convertedPrice = new CurrencyConverter({
                from: offer.price.currency,
                to: 'EUR',
                amount: totalPrice,
              });
              convertedPrice.convert();
              return { ...offer, convertedPrice };
            },
          ),
        );
        return { ...hotel, offers: convertedOffers };
      }),
    );

    // Trier les hôtels par prix total en EUR
    const sortedHotels = hotelsWithConvertedPrices.sort((a, b) => {
      const minPriceA = Math.min(
        ...a.offers.map(
          (offer: { convertedPrice: number }) => offer.convertedPrice,
        ),
      );
      const minPriceB = Math.min(
        ...b.offers.map(
          (offer: { convertedPrice: number }) => offer.convertedPrice,
        ),
      );
      return minPriceA - minPriceB;
    });

    const cheapestHotels = sortedHotels.slice(0, 8);

    console.log('Cheapest hotels:', cheapestHotels.length);

    const prompt = `Filtre ces hôtels pour un séjour de ${totalNights} nuits avec un budget total de ${criteria.maxPrice} EUR. Hôtels: ${JSON.stringify(cheapestHotels)}.
      Renvoie uniquement les IDs des 3 hôtels sélectionnés les moins chères qui ce rapproche des critères, sous forme de liste JSON, comme ceci: {"hotelIds": ["AMTYOATK", "AKTYOAMA", "AZTYO510"]}`;

    const assistant = await this.openai.beta.assistants.create({
      name: 'hotel-filtering',
      instructions:
        "Tu es un assistant de réservation d'hôtels. Filtre les hôtels selon les critères donnés et renvoie uniquement les IDs des hôtels sélectionnés sous forme de liste JSON, comme ceci: {'hotelIds': ['ID1', 'ID2', 'ID3']}.",
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
        'Filtre les hôtels selon les critères donnés et renvoie les IDs des hôtels sélectionnés sous forme de liste JSON.',
    });

    if (run.status === 'completed') {
      const response = await this.openai.beta.threads.messages.list(
        run.thread_id,
      );
      const messageContent: MessageContent = response.data[0].content[0];

      console.log('Message content hotels:', messageContent);

      try {
        // Vérifie que le contenu est bien du texte
        if (messageContent.type === 'text') {
          // Extraire le contenu JSON du bloc de texte
          const regex = /```json\s*([\s\S]*?)\s*```/;

          const jsonMatch = messageContent.text.value.match(regex);

          if (!jsonMatch) {
            throw new Error('No JSON block found in message content');
          }

          const hotelIdResponse = JSON.parse(jsonMatch[1]);
          if (hotelIdResponse && Array.isArray(hotelIdResponse.hotelIds)) {
            hotelIds.push(...hotelIdResponse.hotelIds);
          } else {
            console.error('Invalid format for hotel IDs:', hotelIdResponse);
            throw new Error('Invalid format for hotel IDs');
          }
        } else {
          throw new Error('Message content is not a text block');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response from AI assistant');
      }
    } else {
      console.error('Run status not completed:', run.status);
      return run.status;
    }

    await this.delay(10000); // Ajoute un délai de 10 secondes entre chaque requête pour éviter de dépasser la limite TPM

    // Filtrage final avec les IDs collectés
    const finalHotels = hotels.filter((hotel) =>
      hotelIds.includes(hotel.hotel.hotelId),
    );

    const finalPrompt = `Parmi ces hôtels sélectionnés, choisis les trois meilleurs pour un séjour de ${totalNights} nuits avec un budget total de ${criteria.maxPrice} EUR. Hôtels: ${JSON.stringify(finalHotels)}.
    Renvoie les détails complets des trois meilleurs hôtels sélectionnés.`;

    const finalAssistant = await this.openai.beta.assistants.create({
      name: 'final-hotel-filtering',
      instructions:
        "Tu es un assistant de réservation d'hôtels. Choisis les trois meilleurs hôtels parmi ceux sélectionnés et renvoie les détails complets.",
      model: 'gpt-4o',
    });

    const finalThreadId = await this.threadConversation();
    await this.openai.beta.threads.messages.create(finalThreadId.id, {
      role: 'user',
      content: finalPrompt,
    });

    const finalRun = await this.openai.beta.threads.runs.createAndPoll(
      finalThreadId.id,
      {
        assistant_id: finalAssistant.id,
        instructions:
          'Choisis les trois meilleurs hôtels parmi ceux sélectionnés et renvoie les détails complets.',
      },
    );

    if (finalRun.status === 'completed') {
      const finalResponse = await this.openai.beta.threads.messages.list(
        finalThreadId.id,
      );
      const finalMessageContent = finalResponse.data[0].content;

      try {
        return JSON.parse(JSON.stringify(finalMessageContent));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response from AI assistant');
      }
    } else {
      console.error('Final run status not completed:', finalRun.status);
      return finalRun.status;
    }
  }

  async filterActivitiesWithAI(activities: any[], criteria: any) {
    const chunkedActivities = this.chunkArray(activities, 50); // Par exemple, 50 activités par chunk
    const filteredActivities = [];

    for (const chunk of chunkedActivities) {
      const prompt = `Filtre ces activités en fonction des critères: ${JSON.stringify(criteria)}. Activités: ${JSON.stringify(chunk)}`;

      const assistant = await this.openai.beta.assistants.create({
        name: 'activity-filtering',
        instructions:
          "Tu es un assistant de réservation d'activités. Filtre les activités selon les critères donnés.",
        model: 'gpt-4o',
      });

      const threadId = await this.threadConversation();
      await this.openai.beta.threads.messages.create(threadId.id, {
        role: 'user',
        content: prompt,
      });

      const run = await this.openai.beta.threads.runs.createAndPoll(
        threadId.id,
        {
          assistant_id: assistant.id,
          instructions: 'Filtre les activités selon les critères donnés.',
        },
      );

      if (run.status === 'completed') {
        const response = await this.openai.beta.threads.messages.list(
          run.thread_id,
        );
        const messageContent = response.data[0].content;

        try {
          filteredActivities.push(
            ...JSON.parse(JSON.stringify(messageContent)),
          );
        } catch (error) {
          console.error('Error parsing JSON:', error);
          throw new Error('Failed to parse JSON response from AI assistant');
        }
      } else {
        return run.status;
      }
      await this.delay(2000); // Ajoute un délai de 2 secondes entre chaque requête
    }

    return filteredActivities;
  }

  async searchActivitiesWithKeywords(
    criteria: assistantCriteriaDto,
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

      console.log('Activities response:', response.data.results);

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

  async createItinerary(hotelLocation: string, activities: any, criteria: any) {
    try {
      return await this.planItineraryWithAI(
        hotelLocation,
        activities,
        criteria,
      );
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw new Error('Failed to create itinerary');
    }
  }

  async planItineraryWithAI(
    hotelLocation: string,
    activities: any,
    criteria: any,
  ) {
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

  async threadConversation() {
    try {
      return await this.openai.beta.threads.create();
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  }

  // Fonction pour diviser un tableau en chunks
  private chunkArray(array: any[], chunkSize: number): any[][] {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  }

  // Fonction pour ajouter un délai
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private calculateBudgetPerService(criteria: assistantCriteriaDto): {
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
