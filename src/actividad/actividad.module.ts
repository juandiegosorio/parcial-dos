import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadController } from './actividad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  providers: [ActividadService],
  exports: [ActividadService],
  controllers: [ActividadController]
})
export class ActividadModule {}
