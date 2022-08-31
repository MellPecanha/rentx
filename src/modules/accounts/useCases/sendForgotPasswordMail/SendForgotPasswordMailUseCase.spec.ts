import {UsersRepositoryInMemory} from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import {UsersTokensRepositoryInMemory} from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';

import {DayJsDateProvider} from '@shared/container/providers/dateProvider/implementations/DayJsDateProvider';
import {MailProviderInMemory} from '@shared/container/providers/mailProvider/in-memory/MailProviderInMemory';
import {AppError} from '@shared/errors/AppError';

import {SendForgotPasswordMailUseCase} from './SendForgotPasswordMailUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let mailProviderInMemory: MailProviderInMemory;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe('send forgot password mail', () => {
    beforeEach(() => {
        mailProviderInMemory = new MailProviderInMemory();
        dateProvider = new DayJsDateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProviderInMemory,
        );
    });

    it('should be able to send a forgot password mail to user', async () => {
        const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail');

        const user = {
            name: 'Victor McDaniel',
            email: 'egaol@gijgu.ci',
            password: 'kHKj39',
            driver_license: '1086',
        };

        await usersRepositoryInMemory.create(user);

        await sendForgotPasswordMailUseCase.execute(user.email);

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to send a forgot password mail if user does not exists!', async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute('pm@feruw.zw'),
        ).rejects.toEqual(new AppError('User does not exists!'));
    });

    it('should be able to create user token', async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            'create',
        );

        const user = {
            name: 'Rena James',
            email: 'puvdezer@jeljolah.sm',
            password: 'vwISXu',
            driver_license: '3438',
        };

        await usersRepositoryInMemory.create(user);

        await sendForgotPasswordMailUseCase.execute(user.email);

        expect(generateTokenMail).toHaveBeenCalled();
    });
});
