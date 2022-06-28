import {CarsRepositoryInMemory} from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import {CreateCarUseCase} from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('create car', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory;
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it('should be able to create a new car', async () => {
        await createCarUseCase.execute({
            name: 'car name',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });
    });
});
