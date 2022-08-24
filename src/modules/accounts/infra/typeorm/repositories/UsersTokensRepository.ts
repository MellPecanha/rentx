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
}

export {UsersTokensRepository};
