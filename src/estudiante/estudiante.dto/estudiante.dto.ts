import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class EstudianteDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsEmail()
  @IsNotEmpty()
  readonly correo: string;

  @IsString()
  @IsNotEmpty()
  readonly programa: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly semestre: number;
}
