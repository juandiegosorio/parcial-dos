import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseniaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comentario: string;
  @Column()
  fecha: string;
  @Column()
  calificacion: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.resenias, {
    nullable: true,
  })
  estudiante: EstudianteEntity;
  @ManyToOne(() => ActividadEntity, (actividad) => actividad.resenias, {
    nullable: true,
  })
  actividad: ActividadEntity;
}
