import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ReseniaEntity } from '../../resenia/resenia.entity/resenia.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActividadEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;
  @Column()
  fecha: string;
  @Column()
  cupoMaximo: number;
  @Column()
  estado: number;

  @ManyToMany(() => EstudianteEntity, (estudiante) => estudiante.actividades)
  @JoinTable()
  estudiantes: EstudianteEntity[];

  @OneToMany(() => ReseniaEntity, (resenia) => resenia.actividad)
  resenias: ReseniaEntity[];
}
