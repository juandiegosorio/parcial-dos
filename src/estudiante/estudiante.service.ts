import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';

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
    const estudiante = this.findOne(estudianteID);
    const actividad: ActividadEntity | null =
      await this.actividadRepository.findOne({
        where: { id: actividadID },
        relations: ['actividades', 'resenias'],
      });
    if (!actividad) {
      throw new BusinessLogicException(
        'La actividad no se encontro',
        BusinessError.NOT_FOUND,
      );
    }
    if (
      actividad.estudiantes.length < actividad.cupoMaximo &&
      (await estudiante).actividades.length == 0
    ) {
      const estudianteEntity = await estudiante;
      estudianteEntity.actividades.push(actividad);
      actividad.estudiantes.push(estudianteEntity);
      await this.estudianteRepository.save(estudianteEntity);
      await this.actividadRepository.save(actividad);
      return estudianteEntity;
    }
  }
}
