import {container} from 'tsyringe';
import {ICategoriesRepository} from '@modules/cars/repositories/ICategoriesRepository';
import {SpecificationsRepository} from '@modules/cars/repositories/implementations/SpecificationsRepository';
import {ISpecificationRepository} from '@modules/cars/repositories/ISpecificationRepository';
import {UsersRepository} from '@modules/accounts/repositories/implementations/UsersRepository';
import {IUsersRepository} from '@modules/accounts/repositories/IUsersRepository';
import {CategoriesRepository} from '@modules/cars/repositories/implementations/CategoriesRepository';

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
)
