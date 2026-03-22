import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePivotDto } from './dto/create-pivot.dto';
import { UpdatePivotDto } from './dto/update-pivot.dto';
import { PrismaService } from '../prisma.service';
import { PivotCommandDto } from './dto/pivot-command.dto';

@Injectable()
export class PivotService {
  constructor(private prisma: PrismaService) {}

  async create(createPivotDto: CreatePivotDto) {
    return this.prisma.pivot.create({
      data: createPivotDto,
    });
  }

  async sendCommand(id: string, dto: PivotCommandDto) {
    const pivot = await this.findOne(id);

    const newState = await this.prisma.state.create({
      data: {
        pivotId: id,
        isOn: dto.isOn,
        direction: dto.direction,
        isIrrigating: dto.isIrrigating,
        timestamp: new Date(),
      },
    });

    if (dto.isOn) {
      await this.prisma.cycle.create({
        data: {
          stateId: newState.id,
          percentimeter: dto.percentimeter,
          angle: 0,
          timestamp: new Date(),
        },
      });
    }

    return { message: 'Comando enviado com sucesso', stateId: newState.id };
  }

  async findAll(farmId?: string) {
    if (farmId) {
      return this.prisma.pivot.findMany({
        where: { farmId: farmId },
      });
    }
    return this.prisma.pivot.findMany();
  }

  async findOne(id: string) {
    const pivot = await this.prisma.pivot.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!pivot) throw new NotFoundException(`Pivô não encontrado`);
    return pivot;
  }

  async update(id: string, updatePivotDto: UpdatePivotDto) {
    await this.findOne(id);
    return this.prisma.pivot.update({
      where: { id },
      data: updatePivotDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pivot.delete({
      where: { id },
    });
  }

  async getHistory(id: string, start?: string, end?: string) {
    await this.findOne(id);

    const whereClause: any = { pivotId: id };

    if (start || end) {
      whereClause.timestamp = {};
      if (start) {
        // Define o início do dia (00:00:00)
        whereClause.timestamp.gte = new Date(start);
      }
      if (end) {
        // Define o fim do dia (23:59:59) para abranger o dia todo
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        whereClause.timestamp.lte = endDate;
      }
    }

    return this.prisma.state.findMany({
      where: whereClause,
      include: {
        cycles: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }
}
