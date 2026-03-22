import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FarmService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.farm.findMany();
  }
}