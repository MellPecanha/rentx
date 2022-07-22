import {SpecificationRepositoryInMemory} from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import {CarsRepositoryInMemory} from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import {CreateCarSpecificationUseCase} from './CreateCarSpecificationUseCase';
import {AppError} from '@shared/errors/AppError';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

describe('create car specification', () => {
    beforeEach(() => {
        specificationRepositoryInMemory = new SpecificationRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationRepositoryInMemory,
        );
    });

    it('should be able to add a new specification to a non-existent car', async () => {
        expect(async () => {
            const car_id = '123';
            const specifications_id = ['321'];

            await createCarSpecificationUseCase.execute({car_id, specifications_id});
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to add a new specification to the car', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'car name',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });

        const specification = await specificationRepositoryInMemory.create({
            name: 'test',
            description: 'test',
        });

        const specifications_id = [specification.id];

        const specificationsCars = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id
        });

        expect(specificationsCars).toHaveProperty('specifications');
        expect(specificationsCars.specifications.length).toBe(1);
    });
});