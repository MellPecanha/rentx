import {AppError} from '@shared/errors/AppError';
import {RentalsRepositoryInMemory} from '@modules/rentals/infra/typeorm/repositories/in-memory/RentalsRepositoryInMemory';
import {CreateRentalUseCase} from './CreateRentalUseCase';
import dayjs from 'dayjs';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe('create rental', () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
    });

    it('should be able to create a new rental', async () => {
        const rental = await createRentalUseCase.execute({
            user_id: '1234',
            car_id: '5678',
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });


    it('should not be able to create a new rental if there is another open to the same user', async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: '1234',
                car_id: '5678',
                expected_return_date: dayAdd24Hours,
            });

            await createRentalUseCase.execute({
                user_id: '1234',
                car_id: '5678',
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new rental if the is in use', async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: '1111',
                car_id: 'test',
                expected_return_date: dayAdd24Hours,
            });

            await createRentalUseCase.execute({
                user_id: '2222',
                car_id: 'test',
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new rental with invalid return time', async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: '1111',
                car_id: 'test',
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
