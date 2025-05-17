import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReseniaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  readonly comentario: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsString()
  @IsNotEmpty()
  readonly calificacion: string;
}
