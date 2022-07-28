import {container} from 'tsyringe';

import {ICategoriesRepository} from '@modules/cars/repositories/ICategoriesRepository';
import {SpecificationsRepository} from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import {ISpecificationRepository} from '@modules/cars/repositories/ISpecificationRepository';
import {UsersRepository} from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import {IUsersRepository} from '@modules/accounts/repositories/IUsersRepository';
import {CategoriesRepository} from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import {ICarsRepository} from '@modules/cars/repositories/ICarsRepository';
import {CarsRepository} from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import {ICarsImagesRepository} from '@modules/cars/repositories/ICarsImageRepository';
import {CarsImagesRepository} from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';

container.registerSingleton<ICategoriesRepository>(
    'CategoriesRepository',
    CategoriesRepository
);

container.registerSingleton<ISpecificationRepository>(
    'SpecificationsRepository',
    SpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
);

container.registerSingleton<ICarsRepository>(
    'CarsRepository',
    CarsRepository
);

container.registerSingleton<ICarsImagesRepository>(
    'CarsImagesRepository',
    CarsImagesRepository
);
