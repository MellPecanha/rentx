import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {IRentalsRepository} from '@modules/rentals/repositories/IRentalsRepository';
import {Rental} from '@modules/rentals/infra/typeorm/entities/Rental';
import {AppError} from '@shared/errors/AppError';

dayjs.extend(utc);

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

class CreateRentalUseCase {
    constructor(
        private rentalsRepository: IRentalsRepository
    ) {}

    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        const minimumHours = 24;

        const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

        if(carUnavailable) {
            throw new AppError('car is unavailable');
        }

        const rentalOpenToUse = await this.rentalsRepository.findOpenRentalByUser(user_id);

        if(rentalOpenToUse) {
            throw new AppError('there is a rental in progress for user');
        }

        const expectedReturnDateFormat = dayjs(expected_return_date).utc().local().format('DD-MM-YYYY');

        const dateNow = dayjs().utc().local().format('DD-MM-YYYY');

        const compare = dayjs(expectedReturnDateFormat).diff(dateNow, 'hours');

        if(compare < minimumHours) {
            throw new AppError('invalid return time!');
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        return rental;
    }
}

export {CreateRentalUseCase};
