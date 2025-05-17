import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseniaModule } from './resenia/resenia.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from './actividad/actividad.entity/actividad.entity';
import { ReseniaEntity } from './resenia/resenia.entity/resenia.entity';

@Module({
  imports: [
    EstudianteModule,
    ActividadModule,
    ReseniaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcialdos',
      entities: [EstudianteEntity, ActividadEntity, ReseniaEntity],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
