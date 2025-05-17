import { Test, TestingModule } from '@nestjs/testing';
import { ReseniaService } from './resenia.service';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { ReseniaDto } from './resenia.dto/resenia.dto';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let reseniaRepository: Repository<ReseniaEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiante: EstudianteEntity;
  let actividad: ActividadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    reseniaRepository = module.get<Repository<ReseniaEntity>>(
      getRepositoryToken(ReseniaEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await reseniaRepository.clear();
    await estudianteRepository.clear();
    await actividadRepository.clear();

    // Create a student
    estudiante = await estudianteRepository.save({
      cedula: 123456789,
      nombre: 'Estudiante Test',
      correo: 'estudiante@test.com',
      programa: 'Programa Test',
      semestre: 5,
      actividades: [],
      resenias: [],
    });

    // Create an activity
    actividad = await actividadRepository.save({
      titulo: 'Actividad Test',
      fecha: '2025-05-17',
      cupoMaximo: 1,
      estado: 2, // Completed status
      estudiantes: [],
      resenias: [],
    });

    // Associate student with activity
    actividad.estudiantes = [estudiante];
    estudiante.actividades = [actividad];
    await estudianteRepository.save(estudiante);
    await actividadRepository.save(actividad);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('agregarResenia', () => {
    it('should create a valid review', async () => {
      const reseniaDto: ReseniaDto = {
        comentario: 'Excelente actividad',
        fecha: '2025-05-18',
        calificacion: '5',
      };

      const result = await service.agregarResenia(
        actividad.id,
        estudiante.id,
        reseniaDto,
      );

      expect(result).toBeDefined();
      expect(result.comentario).toEqual(reseniaDto.comentario);
      expect(result.estudiante).toBeDefined();
      expect(result.estudiante.id).toEqual(estudiante.id);
      expect(result.actividad).toBeDefined();
      expect(result.actividad.id).toEqual(actividad.id);
    });

    it('should throw an exception when student does not exist', async () => {
      const reseniaDto: ReseniaDto = {
        comentario: 'Comentario prueba',
        fecha: '2025-05-18',
        calificacion: '4',
      };

      await expect(() =>
        service.agregarResenia(actividad.id, 999, reseniaDto),
      ).rejects.toThrow('Estudiante no encontrado');
    });

    it('should throw an exception when student is not registered for activity', async () => {
      // Create another student who is not registered for the activity
      const otherEstudiante = await estudianteRepository.save({
        cedula: 987654321,
        nombre: 'Otro Estudiante',
        correo: 'otro@test.com',
        programa: 'Programa Test',
        semestre: 3,
        actividades: [],
        resenias: [],
      });

      const reseniaDto: ReseniaDto = {
        comentario: 'Comentario prueba',
        fecha: '2025-05-18',
        calificacion: '4',
      };

      await expect(() =>
        service.agregarResenia(actividad.id, otherEstudiante.id, reseniaDto),
      ).rejects.toThrow('El estudiante no estuvo inscrito en esta actividad');
    });

    it('should throw an exception when activity is not completed', async () => {
      // Create an activity that is not in completed state
      const incompleteActividad = await actividadRepository.save({
        titulo: 'Actividad Incompleta',
        fecha: '2025-05-20',
        cupoMaximo: 1,
        estado: 1, // In progress status
        estudiantes: [estudiante],
        resenias: [],
      });

      // Update the student to include this activity
      estudiante.actividades.push(incompleteActividad);
      await estudianteRepository.save(estudiante);

      const reseniaDto: ReseniaDto = {
        comentario: 'Comentario prueba',
        fecha: '2025-05-21',
        calificacion: '3',
      };

      await expect(() =>
        service.agregarResenia(
          incompleteActividad.id,
          estudiante.id,
          reseniaDto,
        ),
      ).rejects.toThrow('La actividad no está finalizada');
    });
  });

  describe('updateResenia', () => {
    it('should update an existing review', async () => {
      // First create a review
      const resenia = new ReseniaEntity();
      resenia.comentario = 'Comentario inicial';
      resenia.fecha = '2025-05-18';
      resenia.calificacion = '4';
      resenia.estudiante = estudiante;
      resenia.actividad = actividad;

      const savedResenia = await reseniaRepository.save(resenia);

      // Now update it
      savedResenia.comentario = 'Comentario actualizado';
      const updatedResenia = await service.updateResenia(savedResenia);

      expect(updatedResenia).toBeDefined();
      expect(updatedResenia.comentario).toEqual('Comentario actualizado');
      expect(updatedResenia.id).toEqual(savedResenia.id);
    });
  });
});
