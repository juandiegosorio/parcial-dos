import { Injectable } from '@nestjs/common';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';

@Injectable()
export class ReseniaService {
  constructor(
    @InjectRepository(ReseniaEntity)
    private readonly reseniaRepository: Repository<ReseniaEntity>,
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async agregarResenia(actividadID: number, estudianteID: number) {
    const estudiante: EstudianteEntity | null =
      await this.estudianteRepository.findOne({
        where: { id: estudianteID },
        relations: ['actividades', 'resenias'],
      });
    const nuevaResenia = new ReseniaEntity();
    nuevaResenia.actividadId = actividadID;
    nuevaResenia.estudiante = estudiante;
    nuevaResenia.fecha = new Date();


    return await this.reseniaRepository.save(nuevaResenia);
  }
}
