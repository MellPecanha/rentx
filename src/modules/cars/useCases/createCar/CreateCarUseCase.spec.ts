import {CarsRepositoryInMemory} from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import {AppError} from '@shared/errors/AppError';

import {CreateCarUseCase} from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('create car', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it('should be able to create a new car', async () => {
        const car = await createCarUseCase.execute({
            name: 'car name',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });

        expect(car).toHaveProperty('id');
    });

    it('should not be able to create a new car that license plate already exists', async () => {
        await createCarUseCase.execute({
            name: 'car name 1',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });

        await expect(
            createCarUseCase.execute({
                name: 'car name 2',
                description: 'car description',
                daily_rate: 100,
                license_plate: 'license_plate',
                fine_amount: 99,
                brand: 'brand',
                category_id: 'category',
            }),
        ).rejects.toEqual(new AppError('Car already exists!'));
    });

    it('should not be able to create a car with available true by default', async () => {
        const car = await createCarUseCase.execute({
            name: 'car available',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });

        expect(car.available).toBe(true);
    });
});
