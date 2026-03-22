import { Controller, Get, UseGuards } from '@nestjs/common';
import { FarmService } from './farm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('farm')
@UseGuards(JwtAuthGuard)
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Get()
  findAll() {
    return this.farmService.findAll();
  }
}