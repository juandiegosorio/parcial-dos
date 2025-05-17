import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiantesList: EstudianteEntity[];
  let actividad: ActividadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    estudianteRepository.clear();
    actividadRepository.clear();

    estudiantesList = [];
    for (let i = 0; i < 5; i++) {
      const estudiante: EstudianteEntity = await estudianteRepository.save({
        cedula: 10000000 + i,
        nombre: `Estudiante ${i}`,
        correo: `estudiante${i}@example.com`,
        programa: `Programa ${i}`,
        semestre: i + 1,
      });
      estudiantesList.push(estudiante);
    }

    actividad = await actividadRepository.save({
      titulo: 'Actividad Test',
      fecha: '2025-05-17',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an estudiante by id', async () => {
      const estudiante: EstudianteEntity = estudiantesList[0];
      const result: EstudianteEntity = await service.findOne(estudiante.id);
      expect(result).not.toBeNull();
      expect(result.id).toEqual(estudiante.id);
      expect(result.nombre).toEqual(estudiante.nombre);
    });

    it('should throw an exception when estudiante does not exist', async () => {
      await expect(() => service.findOne(0)).rejects.toThrow(
        BusinessLogicException,
      );
      await expect(() => service.findOne(0)).rejects.toThrow(
        'The estudiante with the given id was not found',
      );
    });
  });

  describe('create', () => {
    it('should create a valid estudiante', async () => {
      const newEstudiante: EstudianteEntity = new EstudianteEntity();
      newEstudiante.cedula = 123456789;
      newEstudiante.nombre = 'Nuevo Estudiante';
      newEstudiante.correo = 'nuevo@example.com';
      newEstudiante.programa = 'Nuevo Programa';
      newEstudiante.semestre = 5;

      const result: EstudianteEntity = await service.create(newEstudiante);
      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();
      expect(result.nombre).toEqual(newEstudiante.nombre);
    });

    it('should throw an exception when estudiante has invalid email', async () => {
      const newEstudiante: EstudianteEntity = new EstudianteEntity();
      newEstudiante.cedula = 123456789;
      newEstudiante.nombre = 'Invalid Email';
      newEstudiante.correo = 'not-an-email'; // Invalid email format
      newEstudiante.programa = 'Test Program';
      newEstudiante.semestre = 5;

      await expect(() => service.create(newEstudiante)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw an exception when semestre is out of range', async () => {
      const newEstudiante: EstudianteEntity = new EstudianteEntity();
      newEstudiante.cedula = 123456789;
      newEstudiante.nombre = 'Out of Range';
      newEstudiante.correo = 'valid@example.com';
      newEstudiante.programa = 'Test Program';
      newEstudiante.semestre = 11; // Out of valid range (1-10)

      await expect(() => service.create(newEstudiante)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('inscribirseActividad', () => {
    it('should register a student for an activity', async () => {
      // First ensure the activity has space and the student has no activities
      const estudiante = estudiantesList[0];
      const result = await service.inscribirseActividad(
        estudiante.id,
        actividad.id,
      );

      expect(result).toBeDefined();
      expect(result.id).toEqual(estudiante.id);
      expect(result.actividades).toHaveLength(1);
      expect(result.actividades[0].id).toEqual(actividad.id);

      // Verify that the activity now has the student
      const updatedActividad = await actividadRepository.findOne({
        where: { id: actividad.id },
        relations: ['estudiantes'],
      });
      expect(updatedActividad).not.toBeNull();
      expect(updatedActividad?.estudiantes).toBeDefined();
      expect(updatedActividad?.estudiantes).toHaveLength(1);
      expect(updatedActividad?.estudiantes[0].id).toEqual(estudiante.id);
    });

    it('should throw an exception when activity does not exist', async () => {
      const estudiante = estudiantesList[0];
      await expect(() =>
        service.inscribirseActividad(estudiante.id, 0),
      ).rejects.toThrow();
    });

    it('should throw an exception when student already has an activity', async () => {
      // First register the student
      const estudiante = estudiantesList[1];
      await service.inscribirseActividad(estudiante.id, actividad.id);

      // Create a second activity
      const secondActividad = await actividadRepository.save({
        titulo: 'Segunda Actividad',
        fecha: '2025-05-18',
        cupoMaximo: 10,
        estado: 0,
        estudiantes: [],
      });

      // Try to register the same student for the second activity
      await expect(() =>
        service.inscribirseActividad(estudiante.id, secondActividad.id),
      ).rejects.toThrow();
    });
  });
});
