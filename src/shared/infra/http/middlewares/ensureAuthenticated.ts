import auth from '@config/auth';
import {UsersTokensRepository} from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import {NextFunction, Request, Response} from 'express';
import {verify} from 'jsonwebtoken';

import {AppError} from '@shared/errors/AppError';

interface IPayload {
    sub: string;
}

async function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;
    const userTokenRepository = new UsersTokensRepository();

    if (!authHeader) {
        throw new AppError(`Token missing`, 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const {sub: user_id} = verify(
            token,
            auth.secret_refresh_token,
        ) as IPayload;

        const user = await userTokenRepository.findByUserIdAndRefreshToken(
            user_id,
            token,
        );

        if (!user) {
            throw new AppError(`User ${user_id} does not exist`, 401);
        }

        req.user = {
            id: user_id,
        };

        next();
    } catch (err) {
        throw new AppError(`Invalid token`, 401);
    }
}

export {ensureAuthenticated};
