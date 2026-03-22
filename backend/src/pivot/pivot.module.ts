import { Module } from '@nestjs/common';
import { PivotService } from './pivot.service';
import { PivotController } from './pivot.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PivotController],
  providers: [PivotService, PrismaService],
})
export class PivotModule {}