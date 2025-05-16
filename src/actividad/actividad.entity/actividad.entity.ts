import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
}
