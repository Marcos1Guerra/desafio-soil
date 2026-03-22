import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('mqtt-packets') private mqttQueue: Queue,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('simulate-mqtt')
  async simulateMqtt(@Body() data: any) {
    await this.mqttQueue.add('process-packet', data);
    return { status: 'Simulação enviada para a fila Redis!' };
  }
}