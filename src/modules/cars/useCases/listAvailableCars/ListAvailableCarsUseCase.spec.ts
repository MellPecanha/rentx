import {CarsRepositoryInMemory} from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import {ListAvailableCarsUseCase} from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('list cars', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory,
        );
    });

    it('should be able to list all available cars', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car name',
            description: 'Car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1234',
            fine_amount: 100,
            brand: 'Car brand',
            category_id: 'category id',
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by category', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'car name',
            description: 'car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1235',
            fine_amount: 100,
            brand: 'car brand',
            category_id: '123456',
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: '123456',
        });

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by name', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'car name test',
            description: 'car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1236',
            fine_amount: 100,
            brand: 'car brand',
            category_id: 'category id',
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: 'car name test',
        });

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by brand', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'car name',
            description: 'car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1237',
            fine_amount: 100,
            brand: 'car brand test',
            category_id: 'category id',
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: 'car brand test',
        });

        expect(cars).toEqual([car]);
    });
});
