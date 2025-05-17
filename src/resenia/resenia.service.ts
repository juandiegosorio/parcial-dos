import { Injectable } from '@nestjs/common';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ReseniaDto } from './resenia.dto/resenia.dto';

@Injectable()
export class ReseniaService {
  constructor(
    @InjectRepository(ReseniaEntity)
    private readonly reseniaRepository: Repository<ReseniaEntity>,
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}
  async agregarResenia(
    actividadID: number,
    estudianteID: number,
    reseniaDto: ReseniaDto,
  ) {
    // Find the student with their activities
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteID },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const actividadEncontrada = estudiante.actividades?.find(
      (act) => act.id === actividadID,
    );

    if (!actividadEncontrada) {
      throw new Error('El estudiante no estuvo inscrito en esta actividad');
    }

    if (!(actividadEncontrada.estado == 2)) {
      throw new Error('La actividad no está finalizada');
    }

    // Create and save the review with all required fields
    const nuevaResenia = new ReseniaEntity();
    nuevaResenia.actividad = actividadEncontrada;
    nuevaResenia.estudiante = estudiante;
    nuevaResenia.comentario = reseniaDto.comentario;
    nuevaResenia.fecha = reseniaDto.fecha;
    nuevaResenia.calificacion = reseniaDto.calificacion;

    return this.reseniaRepository.save(nuevaResenia);
  }

  async updateResenia(resenia: ReseniaEntity): Promise<ReseniaEntity> {
    return this.reseniaRepository.save(resenia);
  }
}
