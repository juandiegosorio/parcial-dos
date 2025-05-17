import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
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
export class EstudianteEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cedula: number;
  @Column()
  nombre: string;
  @Column()
  correo: string;
  @Column()
  programa: string;
  @Column()
  semestre: number;

  @OneToMany(() => ReseniaEntity, (resenia) => resenia.estudiante)
  resenias: ReseniaEntity[];

  @ManyToMany(() => ActividadEntity, (actividad) => actividad.estudiantes)
  @JoinTable()
  actividades: ActividadEntity[];
}
