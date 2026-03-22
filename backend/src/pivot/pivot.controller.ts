import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PivotService } from './pivot.service';
import { CreatePivotDto } from './dto/create-pivot.dto';
import { UpdatePivotDto } from './dto/update-pivot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PivotCommandDto } from './dto/pivot-command.dto';

@Controller('pivot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PivotController {
  constructor(private readonly pivotService: PivotService) {}

  @Post(':id/command')
  @Roles('ADMIN', 'OPERADOR')
  async sendCommand(@Param('id') id: string, @Body() command: PivotCommandDto) {
    return this.pivotService.sendCommand(id, command);
  }

  @Get()
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  findAll(@Query('farmId') farmId?: string) {
    return this.pivotService.findAll(farmId);
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  findOne(@Param('id') id: string) {
    return this.pivotService.findOne(id);
  }

  @Get(':id/history')
  @Roles('ADMIN', 'OPERADOR', 'VISUALIZADOR')
  getHistory(
    @Param('id') id: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.pivotService.getHistory(id, start, end);
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
