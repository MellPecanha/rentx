import {ICarsRepository} from '@modules/cars/repositories/ICarsRepository';
import {Rental} from '@modules/rentals/infra/typeorm/entities/Rental';
import {IRentalsRepository} from '@modules/rentals/repositories/IRentalsRepository';
import {inject, injectable} from 'tsyringe';

import {IDateProvider} from '@shared/container/providers/dateProvider/IDateProvider';
import {AppError} from '@shared/errors/AppError';

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository,

        @inject('DayJsDateProvider')
        private dateProvider: IDateProvider,

        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
    ) {}

    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        const minimumHours = 24;

        const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
            car_id,
        );

        if (carUnavailable) {
            throw new AppError('car is unavailable');
        }

        const rentalOpenToUse =
            await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUse) {
            throw new AppError('there is a rental in progress for user');
        }

        const dateNow = this.dateProvider.dateNow();

        const compare = this.dateProvider.compareInHours(
            dateNow,
            expected_return_date,
        );

        if (compare < minimumHours) {
            throw new AppError('invalid return time!');
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        await this.carsRepository.updateAvailable(car_id, false);

        return rental;
    }
}

export {CreateRentalUseCase};
