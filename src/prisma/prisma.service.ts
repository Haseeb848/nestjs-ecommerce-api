import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get(
            'DATABASE_URL',
            'postgresql://ud8nm5jgzhtfuznwujvn:1ERsSoXwUJNaE8eV49eG@bapiiva7nl372ypest92-postgresql.services.clever-cloud.com:6580/bapiiva7nl372ypest92',
          ),
        },
      },
    });
  }
}


// postgresql://postgres:admin@localhost:5432/shopping