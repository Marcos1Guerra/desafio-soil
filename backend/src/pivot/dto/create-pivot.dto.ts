import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePivotDto {
  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  bladeAt100: number;
}