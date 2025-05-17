import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ActividadDto } from './actividad.dto/actividad.dto';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { ActividadService } from './actividad.service';

@Controller('actividades')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Get(':actividadId')
  async findOne(@Param('actividadId') actividadId: string) {
    return await this.actividadService.findOne(parseInt(actividadId));
  }

  @Post()
  async create(@Body() actividadDto: ActividadDto) {
    const actividad: ActividadEntity = plainToInstance(
      ActividadEntity,
      actividadDto,
    );
    return await this.actividadService.create(actividad);
  }

  @Put(':actividadId/estado/:estado')
  async cambiarEstado(
    @Param('actividadId') actividadId: string,
    @Param('estado') estado: string,
  ) {
    return await this.actividadService.cambiarEstado(
      parseInt(actividadId),
      parseInt(estado),
    );
  }

  @Get()
  async findAllByDate(@Query('fecha') fecha: string) {
    return await this.actividadService.findAllActividadesByDate(fecha);
  }
}
