import {ICreateCarDTO} from '@modules/cars/dtos/ICreateCarDTO';
import {Car} from '@modules/cars/infra/typeorm/entities/Car';

import {ICarsRepository} from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
    cars: Car[] = [];

    async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
            id,
        });

        this.cars.push(car);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.cars.find(car => car.license_plate === license_plate);
    }

    async findAvailable(
        name?: string,
        brand?: string,
        category_id?: string,
    ): Promise<Car[]> {
        const cars = this.cars.filter(car => {
            if (
                car.available === true ||
                (name && car.name === name) ||
                (brand && car.brand === brand) ||
                (category_id && car.category_id === category_id)
            ) {
                return car;
            }

            return null;
        });

        return cars;
    }

    async findById(id: string): Promise<Car> {
        return this.cars.find(c => c.id === id);
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        const findIndex = this.cars.findIndex(c => c.id === id);
        this.cars[findIndex].available = available;
    }
}

export {CarsRepositoryInMemory};
