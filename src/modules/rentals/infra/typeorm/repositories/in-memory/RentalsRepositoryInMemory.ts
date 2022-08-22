import {ICreateRentalDTO} from '@modules/rentals/dtos/ICreateRentalDTO';
import {IRentalsRepository} from '@modules/rentals/repositories/IRentalsRepository';

import {Rental} from '../../entities/Rental';

class RentalsRepositoryInMemory implements IRentalsRepository {
    rentals: Rental[] = [];

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        return this.rentals.find(
            rental => rental.car_id === car_id && !rental.end_date,
        );
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        return this.rentals.find(
            rental => rental.user_id === user_id && !rental.end_date,
        );
    }

    async create({
        user_id,
        car_id,
        expected_return_date,
    }: ICreateRentalDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, {
            user_id,
            car_id,
            start_date: new Date(),
            expected_return_date,
        });

        this.rentals.push(rental);

        return rental;
    }

    async findById(id: string): Promise<Rental> {
        return this.rentals.find(rental => rental.id === id);
    }

    async findByUser(user_id: string): Promise<Rental[]> {
        return this.rentals.filter(rental => rental.user_id === user_id);
    }
}

export {RentalsRepositoryInMemory};
