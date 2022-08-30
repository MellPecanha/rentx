import {ICreateUserTokensDTO} from '../dtos/ICreateUserTokensDTO';
import {UserTokens} from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
    create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokensDTO): Promise<UserTokens>;

    findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string,
    ): Promise<UserTokens>;

    deleteById(id: string): Promise<void>;

    findByRefreshToken(refresh_token: string): Promise<UserTokens>;
}

export {IUsersTokensRepository};
