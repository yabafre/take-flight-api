import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { AmadeusService } from '@/amadeus/amadeus.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap().then(() => {
  console.log('Server is running on http://localhost:3000');
  const configService = new ConfigService();
  const amadeusService = new AmadeusService(configService);
  // amadeusService
  //   .getLocations({
  //     keyword: 'LON',
  //     subType: 'CITY',
  //   })
  //   .then((data) => console.log(JSON.parse(data.body)))
  //   .catch((error) => console.error(error));
});