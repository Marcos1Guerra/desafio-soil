import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('farm')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas deste controller
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @Roles('ADMIN', 'OPERADOR') // Apenas Admin e Operador podem criar
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  @Get()
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR') // Todos podem ver
  findAll() {
    return this.farmService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OPERADOR') // Apenas Admin e Operador podem editar
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Apenas Admin pode deletar
  remove(@Param('id') id: string) {
    return this.farmService.remove(id);
  }
}