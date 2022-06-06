import {compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import {inject, injectable} from 'tsyringe';
import {IUsersRepository} from '../../repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    async execute({email, password}: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        const user_password = await compare(password, user.password);

        if(!user || !user_password) {
            throw new Error(`Email or password incorrect!`);
        }

        const token = sign({}, '87ac04bd0163720ee638600e831d548a', {
            subject: user.id,
            expiresIn: '24h',
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        }

        return tokenReturn;
    }
}

export {AuthenticateUserUseCase};
