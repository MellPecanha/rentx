import {Request, Response} from 'express';
import {CreateCategoryUseCase} from './CreateCategoryUseCase';

class CreateCategoryController {
    constructor(private createCategoriesUseCase: CreateCategoryUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const {name, description} = req.body;

        await this.createCategoriesUseCase.execute({name, description});

        return res.status(201).send();
    }
}

export {CreateCategoryController};
