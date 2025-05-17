/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ReseniaEntity } from '../../resenia/resenia.entity/resenia.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [EstudianteEntity, ActividadEntity, ReseniaEntity],
   synchronize: true,
 }),
 TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity, ReseniaEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/