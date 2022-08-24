import {CarsRepositoryInMemory} from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import {RentalsRepositoryInMemory} from '@modules/rentals/infra/typeorm/repositories/in-memory/RentalsRepositoryInMemory';
import dayjs from 'dayjs';

import {DayJsDateProvider} from '@shared/container/providers/dateProvider/implementations/DayJsDateProvider';
import {AppError} from '@shared/errors/AppError';

import {CreateRentalUseCase} from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayJsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('create rental', () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayJsDateProvider = new DayJsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayJsDateProvider,
            carsRepositoryInMemory,
        );
    });

    it('should be able to create a new rental', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'name test',
            description: 'description test',
            daily_rate: 100,
            license_plate: 'XXX-1234',
            fine_amount: 100,
            brand: 'brand test',
            category_id: 'category_id test',
        });

        const rental = await createRentalUseCase.execute({
            user_id: '1234',
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it('should not be able to create a new rental if there is another open to the same user', async () => {
        await rentalsRepositoryInMemory.create({
            user_id: '1234',
            car_id: '8765',
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: '1234',
                car_id: '5678',
                expected_return_date: dayAdd24Hours,
            }),
        ).rejects.toEqual(
            new AppError('there is a rental in progress for user'),
        );
    });

    it('should not be able to create a new rental if the is in use', async () => {
        await rentalsRepositoryInMemory.create({
            user_id: '1234',
            car_id: 'test',
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: '2222',
                car_id: 'test',
                expected_return_date: new Date(),
            }),
        ).rejects.toEqual(new AppError('car is unavailable'));
    });

    it('should not be able to create a new rental with invalid return time', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'car name',
            description: 'car description',
            daily_rate: 100,
            license_plate: 'license_plate',
            fine_amount: 99,
            brand: 'brand',
            category_id: 'category',
        });

        await expect(
            createRentalUseCase.execute({
                user_id: '1111',
                car_id: car.id,
                expected_return_date: dayjs().toDate(),
            }),
        ).rejects.toEqual(new AppError('invalid return time!'));
    });
});
