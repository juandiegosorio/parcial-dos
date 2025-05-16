import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
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
  
  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.resenias, { nullable: true })
  estudiante: EstudianteEntity;
}