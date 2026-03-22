import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { EventsGateway } from './events.gateway';

@Processor('mqtt-packets')
export class MqttProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { topic, payload } = job.data;
    const pivotId = topic.split('/')[2];


    await this.prisma.pivot.update({
      where: { id: pivotId },
      data: { status: payload },
    });

    let activeState = await this.prisma.state.findFirst({
      where: { pivotId },
      orderBy: { timestamp: 'desc' },
    });

    if (payload.isOn) {
      if (!activeState || !activeState.isOn) {
        activeState = await this.prisma.state.create({
          data: {
            pivotId,
            isOn: true,
            direction: payload.direction,
            isIrrigating: payload.isIrrigating,
            timestamp: new Date(),
          },
        });
      } else {
        activeState = await this.prisma.state.update({
          where: { id: activeState.id },
          data: {
            direction: payload.direction,
            isIrrigating: payload.isIrrigating,
          },
        });
      }

      await this.prisma.cycle.create({
        data: {
          stateId: activeState.id,
          angle: payload.angle ?? 0,
          percentimeter: payload.percentimeter ?? 0,
          timestamp: new Date(),
        },
      });
      
    } else if (!payload.isOn && activeState && activeState.isOn) {
      activeState = await this.prisma.state.update({
        where: { id: activeState.id },
        data: { isOn: false },
      });
    }

    this.eventsGateway.sendPivotUpdate(pivotId, payload);

    return {};
  }
}