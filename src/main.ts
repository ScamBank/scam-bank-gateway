import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const host =
    process.env.EXEC_ENV === 'production' ? '45.130.146.135' : 'localhost';

  const proxies = {
    core: `http://${host}:3000`,
    users: `http://${host}:3001`,
    users1c: 'https://cis.tsu.ru',
  };
  console.log('@proxies', proxies);

  app.use('/api/users', proxy(proxies.users));
  app.use('/api/core', proxy(proxies.core));
  app.use('/api/users1c', proxy(proxies.users1c));

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Gateway is running on port ${process.env.PORT ?? 4000}`);
}
bootstrap();
