import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ActividadService', () => {
  let service: ActividadService;
  let repository: Repository<ActividadEntity>;
  let actividadList: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    actividadList = [];

    for (let i = 0; i < 5; i++) {
      const actividad: ActividadEntity = await repository.save({
        titulo: `Actividad ${i}`,
        fecha: `2025-05-${17 + i}`,
        cupoMaximo: 10 + i,
        estado: 0,
        estudiantes: [],
      });
      actividadList.push(actividad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an actividad by id', async () => {
      const actividad: ActividadEntity = actividadList[0];
      const result: ActividadEntity = await service.findOne(actividad.id);

      expect(result).not.toBeNull();
      expect(result.id).toEqual(actividad.id);
      expect(result.titulo).toEqual(actividad.titulo);
    });

    it('should throw an exception when actividad does not exist', async () => {
      await expect(() => service.findOne(0)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('create', () => {
    it('should create a valid actividad', async () => {
      const newActividad: ActividadEntity = new ActividadEntity();
      newActividad.titulo = 'Nueva Actividad';
      newActividad.fecha = '2025-05-20';
      newActividad.cupoMaximo = 15;
      newActividad.estado = 0;

      const result: ActividadEntity = await service.create(newActividad);

      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();
      expect(result.titulo).toEqual(newActividad.titulo);
    });

    it('should throw an exception when actividad title has symbols', async () => {
      const newActividad: ActividadEntity = new ActividadEntity();
      newActividad.titulo = 'Actividad @!#'; // Contains symbols
      newActividad.fecha = '2025-05-20';
      newActividad.cupoMaximo = 15;
      newActividad.estado = 0;

      await expect(() => service.create(newActividad)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('should throw an exception when actividad title is too long', async () => {
      const newActividad: ActividadEntity = new ActividadEntity();
      newActividad.titulo = 'Este titulo es demasiado largo para ser valido'; // More than 15 characters
      newActividad.fecha = '2025-05-20';
      newActividad.cupoMaximo = 15;
      newActividad.estado = 0;

      await expect(() => service.create(newActividad)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('cambiarEstado', () => {
    it('should change to estado 0 (pendiente) successfully', async () => {
      // First create an activity with estado = 1
      const actividad = await repository.save({
        titulo: 'Actividad Pendiente',
        fecha: '2025-05-20',
        cupoMaximo: 10,
        estado: 1,
        estudiantes: [],
      });

      // Change to estado 0
      const result = await service.cambiarEstado(actividad.id, 0);

      expect(result).not.toBeNull();
      expect(result.estado).toEqual(0);
    });

    it('should throw exception when trying to set estado 1 without enough students', async () => {
      const actividad = actividadList[0]; // Empty activity

      await expect(() =>
        service.cambiarEstado(actividad.id, 1),
      ).rejects.toThrow(BusinessLogicException);
    });

    it('should throw exception when trying to set estado 2 without full capacity', async () => {
      const actividad = actividadList[0]; // Empty activity

      await expect(() =>
        service.cambiarEstado(actividad.id, 2),
      ).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAllActividadesByDate', () => {
    it('should return activities for a specific date', async () => {
      const date = '2025-05-17';
      const result = await service.findAllActividadesByDate(date);

      expect(result).not.toBeNull();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].fecha).toEqual(date);
    });

    it('should return empty array when no activities on date', async () => {
      const date = '2030-01-01'; // Date with no activities
      const result = await service.findAllActividadesByDate(date);

      expect(result).toEqual([]);
    });
  });
});
