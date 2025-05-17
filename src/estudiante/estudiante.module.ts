import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { EstudianteController } from './estudiante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  providers: [EstudianteService],
  exports: [EstudianteService],
  controllers: [EstudianteController]
})
export class EstudianteModule {}
