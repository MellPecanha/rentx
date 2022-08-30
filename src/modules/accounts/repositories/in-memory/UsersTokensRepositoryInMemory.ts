import {ICreateUserTokensDTO} from '@modules/accounts/dtos/ICreateUserTokensDTO';
import {UserTokens} from '@modules/accounts/infra/typeorm/entities/UserTokens';

import {IUsersTokensRepository} from '../IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    usersTokens: UserTokens[] = [];

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokensDTO): Promise<UserTokens> {
        const userTokens = new UserTokens();

        Object.assign(userTokens, {
            user_id,
            refresh_token,
            expires_date,
        });

        this.usersTokens.push(userTokens);

        return userTokens;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string,
    ): Promise<UserTokens> {
        const userToken = await this.usersTokens.find(
            userToken =>
                userToken.user_id === user_id &&
                userToken.refresh_token === refresh_token,
        );

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const userToken = await this.usersTokens.find(
            userToken => userToken.id === id,
        );

        this.usersTokens.splice(this.usersTokens.indexOf(userToken));
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = await this.usersTokens.find(
            token => token.refresh_token === refresh_token,
        );

        return userToken;
    }
}

export {UsersTokensRepositoryInMemory};
