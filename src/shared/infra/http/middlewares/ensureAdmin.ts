import {UsersRepository} from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import {Request, Response, NextFunction} from 'express';

import {AppError} from '@shared/errors/AppError';

async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
    const {id} = req.user;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(id);

    if (!user.isAdmin) {
        throw new AppError(`User '${id}' is not a admin`, 401);
    }

    return next();
}

export {ensureAdmin};
