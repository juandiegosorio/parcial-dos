import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { EstudianteService } from './estudiante.service';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}
  @Get(':estudianteId')
  async findOne(@Param('estudianteId') estudianteId: string) {
    return await this.estudianteService.findOne(parseInt(estudianteId));
  }

  @Post()
  async create(@Body() estudianteDto: EstudianteDto) {
    const estudiante: EstudianteEntity = plainToInstance(
      EstudianteEntity,
      estudianteDto,
    );
    return await this.estudianteService.create(estudiante);
  }

  @Post(':estudianteId/actividades/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId') estudianteId: string,
    @Param('actividadId') actividadId: string,
  ) {
    return await this.estudianteService.inscribirseActividad(
      parseInt(estudianteId),
      parseInt(actividadId),
    );
  }
}
