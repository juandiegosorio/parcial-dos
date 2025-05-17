import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

function isValidEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async findOne(id: number): Promise<EstudianteEntity> {
    const estudiante: EstudianteEntity | null =
      await this.estudianteRepository.findOne({
        where: { id },
        relations: ['actividades', 'resenias'],
      });
    if (!estudiante)
      throw new BusinessLogicException(
        'The estudiante with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return estudiante;
  }

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (
      isValidEmail(estudiante.correo) &&
      estudiante.semestre >= 1 &&
      estudiante.semestre <= 10
    )
      return await this.estudianteRepository.save(estudiante);
    else
      throw new BusinessLogicException(
        'Email incorrecto o el semestre del estudiante debe ser entre 1 y 10',
        BusinessError.PRECONDITION_FAILED,
      );
  }
  async inscribirseActividad(estudianteID: number, actividadID: number) {
    const estudiante = await this.findOne(estudianteID);
    const actividad: ActividadEntity | null =
      await this.actividadRepository.findOne({
        where: { id: actividadID },
        relations: ['estudiantes', 'resenias'],
      });
    if (!actividad) {
      throw new BusinessLogicException(
        'La actividad no se encontro',
        BusinessError.NOT_FOUND,
      );
    }
    
    // Initialize arrays if they don't exist
    if (!actividad.estudiantes) {
      actividad.estudiantes = [];
    }
    
    if (!estudiante.actividades) {
      estudiante.actividades = [];
    }
    
    if (
      actividad.estudiantes.length < actividad.cupoMaximo &&
      estudiante.actividades.length === 0
    ) {
      estudiante.actividades.push(actividad);
      actividad.estudiantes.push(estudiante);
      await this.estudianteRepository.save(estudiante);
      await this.actividadRepository.save(actividad);
      
      // Return a plain object to avoid circular JSON reference
      return {
        id: estudiante.id,
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
        correo: estudiante.correo,
        programa: estudiante.programa,
        semestre: estudiante.semestre,
        actividades: [{
          id: actividad.id,
          titulo: actividad.titulo,
          fecha: actividad.fecha,
          cupoMaximo: actividad.cupoMaximo,
          estado: actividad.estado
        }]
      };
    } else {
      throw new BusinessLogicException(
        'El estudiante ya está inscrito en otra actividad o la actividad está llena',
        BusinessError.PRECONDITION_FAILED
      );
    }
  }
}
