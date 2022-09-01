import auth from '@config/auth';
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

    if (!authHeader) {
        throw new AppError(`Token missing`, 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const {sub: user_id} = verify(token, auth.secret_token) as IPayload;

        req.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError(`Invalid token`, 401);
    }
}

export {ensureAuthenticated};
