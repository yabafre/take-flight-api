import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';

describe('SearchController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/search/flight-offers (GET)', () => {
    return request(app.getHttpServer())
      .get('/search/flight-offers')
      .query({
        originLocationCode: 'SYD',
        destinationLocationCode: 'BKK',
        departureDate: '2024-07-16',
        returnDate: '2024-07-30',
        adults: 2,
        children: 1, // Optionnel, mais on peut tester avec cet attribut
        maxPrice: 1000, // Optionnel, mais on peut tester avec cet attribut
        max: 5, // Optionnel, mais on peut tester avec cet attribut
        currencyCode: 'USD', // Optionnel, mais on peut tester avec cet attribut
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.length).toBeGreaterThan(0);
      });
  });

  // Add more integration tests for other endpoints
});
