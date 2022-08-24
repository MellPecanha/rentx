import {ICreateUserTokensDTO} from '../dtos/ICreateUserTokensDTO';
import {UserTokens} from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
    create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokensDTO): Promise<UserTokens>;
}

export {IUsersTokensRepository};
