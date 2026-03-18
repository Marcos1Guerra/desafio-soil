import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePivotDto } from './dto/create-pivot.dto';
import { UpdatePivotDto } from './dto/update-pivot.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PivotService {
  constructor(private prisma: PrismaService) {}

  async create(createPivotDto: CreatePivotDto) {
    return this.prisma.pivot.create({
      data: createPivotDto,
    });
  }

  async findAll() {
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

  async getHistory(id: string) {
    await this.findOne(id);
    return this.prisma.state.findMany({
      where: { pivotId: id },
      include: {
        cycles: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }
}