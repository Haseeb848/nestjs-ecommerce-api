// import { Module, Global } from '@nestjs/common';
// import { IORedisModule } from 'nestjs-ioredis';

// import * as redis from 'redis';

// @Global()
// @Module({
//   imports: [
//     IORedisModule.forRoot({
//       redis: {
//         Client: redis.RedisClient,
//         options: {
//           url: 'redis://127.0.0.1:6379',
//         },
//       },
//     }),
//   ],
//   exports: [IORedisModule],
// })
// export class RedisCacheModule {}
