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
  await app.listen(3000);
}
bootstrap();
