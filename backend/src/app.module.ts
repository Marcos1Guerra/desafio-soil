import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { MqttProcessor } from './mqtt.processor';
import { MqttService } from './mqtt.service';
import { AuthModule } from './auth/auth.module';
import { EventsGateway } from './events.gateway';
import { FarmModule } from './farm/farm.module';
import { PivotModule } from './pivot/pivot.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mqtt-packets',
    }),
    AuthModule,
    FarmModule,
    PivotModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, MqttProcessor, MqttService, EventsGateway],
})
export class AppModule {}