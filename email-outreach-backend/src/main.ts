import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (or configure as needed)
  app.enableCors();

  // Optionally, configure CORS to allow only specific origins
  // app.enableCors({
  //   origin: 'http://your-react-app-domain.com', // replace with your React app's domain
  //   methods: 'GET,POST',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
