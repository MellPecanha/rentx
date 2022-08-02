import {AppError} from '@shared/errors/AppError';
import {IRentalsRepository} from '@modules/rentals/repositories/IRentalsRepository';

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
    }: IRequest): Promise<void> {
        const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

        if(carUnavailable) {
            throw new AppError('car is unavailable');
        }

        const rentalOpenToUse = await this.rentalsRepository.findOpenRentalByUser(user_id);

        if(rentalOpenToUse) {
            throw new AppError('there is a rental in progress for user');
        }
    }
}

export {CreateRentalUseCase};
