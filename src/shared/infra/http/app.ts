import 'reflect-metadata';
import upload from '@config/upload';
import cors from 'cors';
import 'dotenv/config';
import express, {NextFunction, Request, Response} from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import '@shared/container';
import {AppError} from '@shared/errors/AppError';

import swaggerFile from '../../../swagger.json';
import createConnection from '../typeorm';
import {router} from './routes';

createConnection();
const app = express();

app.use(express.json());

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    return res.status(500).json({
        status: 'error',
        message: `Internal server error - ${err.message}`,
    });
});

export {app};
