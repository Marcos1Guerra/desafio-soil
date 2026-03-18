import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PivotService } from './pivot.service';
import { CreatePivotDto } from './dto/create-pivot.dto';
import { UpdatePivotDto } from './dto/update-pivot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('pivot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PivotController {
  constructor(private readonly pivotService: PivotService) {}

  @Post()
  @Roles('ADMIN', 'OPERADOR')
  create(@Body() createPivotDto: CreatePivotDto) {
    return this.pivotService.create(createPivotDto);
  }

  @Get()
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  findAll() {
    return this.pivotService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  findOne(@Param('id') id: string) {
    return this.pivotService.findOne(id);
  }

  @Get(':id/history')
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  getHistory(@Param('id') id: string) {
    return this.pivotService.getHistory(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OPERADOR')
  update(@Param('id') id: string, @Body() updatePivotDto: UpdatePivotDto) {
    return this.pivotService.update(id, updatePivotDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.pivotService.remove(id);
  }
}