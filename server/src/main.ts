import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (
    process.env.CLIENT_URL ?? 'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const isVercelDomain = (origin: string) => {
    try {
      const { hostname } = new URL(origin);
      return hostname === 'vercel.app' || hostname.endsWith('.vercel.app');
    } catch {
      return false;
    }
  };

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow same-origin and non-browser requests, and validate browser origins.
      const normalizedOrigin = origin?.replace(/\/$/, '');
      if (
        !normalizedOrigin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isVercelDomain(normalizedOrigin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${normalizedOrigin}`), false);
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
