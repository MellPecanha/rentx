import {IRentalsRepository} from '@modules/rentals/repositories/IRentalsRepository';
import {Rental} from '../../entities/Rental';

class RentalsRepositoryInMemory implements IRentalsRepository {
    rentals: Rental[] = [];

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        return this.rentals.find(
            (rental) => rental.car_id === car_id && rental.end_date === null
        );
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        return this.rentals.find(
            (rental) => rental.user_id === user_id && rental.end_date === null
        );
    }
}

export {RentalsRepositoryInMemory};
