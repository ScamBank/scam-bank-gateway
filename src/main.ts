import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('gateway');
  await app.listen(process.env.PORT ?? 4000);

  console.log(`Gateway is running on port ${process.env.PORT ?? 4000}`);
}
bootstrap();
