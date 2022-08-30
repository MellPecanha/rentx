import {ICreateUserTokensDTO} from '@modules/accounts/dtos/ICreateUserTokensDTO';
import {IUsersTokensRepository} from '@modules/accounts/repositories/IUsersTokensRepository';
import {getRepository, Repository} from 'typeorm';

import {UserTokens} from '../entities/UserTokens';

class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserTokens>;

    constructor() {
        this.repository = getRepository(UserTokens);
    }

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokensDTO): Promise<UserTokens> {
        const userToken = this.repository.create({
            user_id,
            refresh_token,
            expires_date,
        });

        await this.repository.save(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string,
    ): Promise<UserTokens> {
        const userTokens = await this.repository.findOne({
            user_id,
            refresh_token,
        });

        return userTokens;
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = await this.repository.findOne({refresh_token});

        return userToken;
    }
}

export {UsersTokensRepository};
