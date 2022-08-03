import {Request, Response} from 'express';
import {container} from 'tsyringe';

import {ListAvailableCarsUseCase} from './ListAvailableCarsUseCase';

class ListAvailableCarsController {
    async handle(req: Request, res: Response): Promise<Response> {
        const {category_id, name, brand} = req.query;

        const listAvailableCarsController = container.resolve(
            ListAvailableCarsUseCase,
        );

        const cars = await listAvailableCarsController.execute({
            name: name as string,
            brand: brand as string,
            category_id: category_id as string,
        });

        return res.json(cars);
    }
}

export {ListAvailableCarsController};
