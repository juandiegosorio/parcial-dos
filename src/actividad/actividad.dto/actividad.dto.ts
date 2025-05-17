import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class ActividadDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;
  
  @IsString()
  @IsNotEmpty()
  readonly fecha: string;
  
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly cupoMaximo: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  readonly estado: number;
}
