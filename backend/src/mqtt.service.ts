import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  constructor(@InjectQueue('mqtt-packets') private packetsQueue: Queue) {}

  onModuleInit() {
    this.client = mqtt.connect('mqtt://test.mosquitto.org'); 

    this.client.on('connect', () => {
      console.log('Conectado ao MQTT Broker!');
      this.client.subscribe('soil/pivots/#'); // Escuta todos os tópicos de pivôs
    });

    this.client.on('message', async (topic, message) => {
      const payload = JSON.parse(message.toString());
      
      await this.packetsQueue.add('process-packet', {
        topic,
        payload,
      });
      console.log(`Pacote do tópico ${topic} enviado para a fila.`);
    });
  }
}