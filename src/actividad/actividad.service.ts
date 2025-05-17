import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity/actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async findOne(id: number): Promise<ActividadEntity> {
    const actividad: ActividadEntity | null =
      await this.actividadRepository.findOne({
        where: { id },
        relations: ['estudiantes', 'resenias'],
      });
    if (!actividad)
      throw new BusinessLogicException(
        'The actividad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return actividad;
  }

  async create(actividad: ActividadEntity): Promise<ActividadEntity> {
    // Check if title contains symbols
    const containsSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      actividad.titulo,
    );

    if (actividad.titulo.length <= 15 && !containsSymbols)
      return this.actividadRepository.save(actividad);
    else
      throw new BusinessLogicException(
        'El título no puede exceder 15 caracteres y no puede contener símbolos',
        BusinessError.PRECONDITION_FAILED,
      );
  }
  async cambiarEstado(actividadID: number, estado: number) {
    const actividadObj = await this.findOne(actividadID);

    // Estado 1 (en progreso): al menos 80% del cupo máximo
    if (
      estado == 1 &&
      actividadObj.estudiantes.length >= actividadObj.cupoMaximo * 0.8
    ) {
      actividadObj.estado = estado;
      return this.actividadRepository.save(actividadObj);
    }
    // Estado 2 (finalizada): cupo completo
    else if (
      estado == 2 &&
      actividadObj.estudiantes.length == actividadObj.cupoMaximo
    ) {
      actividadObj.estado = estado;
      return this.actividadRepository.save(actividadObj);
    }
    // Estado 0 (pendiente): siempre se puede cambiar a pendiente
    else if (estado == 0) {
      actividadObj.estado = estado;
      return this.actividadRepository.save(actividadObj);
    } else {
      throw new BusinessLogicException(
        'No se puede cambiar el estado de la actividad. No cumple con los requisitos necesarios.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }
  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    return this.actividadRepository.find({
      where: { fecha: fecha },
      relations: ['estudiantes', 'resenias'],
    });
  }
}
