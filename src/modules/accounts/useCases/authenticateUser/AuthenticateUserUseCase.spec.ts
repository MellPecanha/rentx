import {ICreateUserDTO} from '@modules/accounts/dtos/ICreateUserDTO';
import {UsersRepositoryInMemory} from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import {UsersTokensRepositoryInMemory} from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';

import {DayJsDateProvider} from '@shared/container/providers/dateProvider/implementations/DayJsDateProvider';
import {AppError} from '@shared/errors/AppError';

import {CreateUserUseCase} from '../createUser/CreateUserUseCase';
import {AuthenticateUserUseCase} from './AuthenticateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayJsDateProvider;

describe('authenticate user', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            name: 'test name',
            email: 'name@test.com',
            password: '1234',
            driver_license: 'test license',
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty('token');
    });

    it('should not be able to authenticate a non-existent user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'name@test.com',
                password: '1234',
            }),
        ).rejects.toEqual(new AppError('Email or password incorrect!'));
    });

    it('should not be able to authenticate with incorrect password', async () => {
        const user: ICreateUserDTO = {
            name: 'test name',
            email: 'name@test.com',
            password: '1234',
            driver_license: 'test license',
        };

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: 'incorrect password',
            }),
        ).rejects.toEqual(new AppError('Email or password incorrect!'));
    });
});
