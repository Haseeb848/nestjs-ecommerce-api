import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // Serve static files from the "uploads" directory
  // app.use('/uploads', express.static('uploads'));
  const host = '0.0.0.0';
  const port = process.env.PORT || 3000;
  await app.listen(port, host);
}
bootstrap();
