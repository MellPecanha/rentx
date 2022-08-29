import {IUsersRepository} from '@modules/accounts/repositories/IUsersRepository';
import {IUsersTokensRepository} from '@modules/accounts/repositories/IUsersTokensRepository';
import {inject, injectable} from 'tsyringe';
import {v4 as uuidV4} from 'uuid';

import {IDateProvider} from '@shared/container/providers/dateProvider/IDateProvider';
import {IMailProvider} from '@shared/container/providers/mailProvider/IMailProvider';

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UsersTokensRepository')
        private usersTokensRepository: IUsersTokensRepository,

        @inject('DayJsDateProvider')
        private dateProvider: IDateProvider,

        @inject('EtherealMailProvider')
        private mailProvider: IMailProvider,
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new Error('User does not exist!');
        }

        const token = uuidV4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date,
        });

        await this.mailProvider.sendMail(
            email,
            'Recuperação de senha',
            `O link para reset é ${token}`,
        );
    }
}

export {SendForgotPasswordMailUseCase};
