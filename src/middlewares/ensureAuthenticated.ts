import {NextFunction, Request, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {UsersRepository} from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
    sub: string;
}

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        throw new Error(`Token missing`);
    }

    const [, token] = authHeader.split(' ');

    try {
        const {sub: user_id} = verify(token, '87ac04bd0163720ee638600e831d548a') as IPayload;

        const usersRepository = new UsersRepository();

        usersRepository.findById(user_id);

        const user = await usersRepository.findById(user_id);

        if(!user) {
            throw new Error(`User ${user_id} does not exist`);
        }

        next();
    } catch {
        throw new Error(`Invalid token`);
    }
}

export {ensureAuthenticated};
