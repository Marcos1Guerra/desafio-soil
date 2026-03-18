import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FarmService {
  constructor(private prisma: PrismaService) {}

  async create(createFarmDto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: createFarmDto,
    });
  }

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
    });
    
    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }
    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    // Verifica se existe antes de atualizar
    await this.findOne(id); 

    return this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
    });
  }

  async remove(id: string) {
    // Verifica se existe antes de deletar
    await this.findOne(id);

    return this.prisma.farm.delete({
      where: { id },
    });
  }
}