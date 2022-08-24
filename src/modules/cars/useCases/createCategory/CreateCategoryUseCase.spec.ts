import {CategoriesRepositoryInMemory} from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';

import {AppError} from '@shared/errors/AppError';

import {CreateCategoryUseCase} from './CreateCategoryUseCase';

let categoryRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe('create category', () => {
    beforeEach(() => {
        categoryRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(
            categoryRepositoryInMemory,
        );
    });

    it('should be able to create a new category', async () => {
        const category = {
            name: 'category test',
            description: 'category description test',
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        const categoryCreated = await categoryRepositoryInMemory.findByName(
            category.name,
        );

        expect(categoryCreated).toHaveProperty('id');
    });

    it('should be not able to create a new category that name already exists', async () => {
        const category = {
            name: 'category test',
            description: 'category description test',
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        await expect(
            createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            }),
        ).rejects.toEqual(
            new AppError(`Category ${category.name} already exists!`),
        );
    });
});
