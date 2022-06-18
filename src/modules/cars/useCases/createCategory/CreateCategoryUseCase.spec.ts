import {AppError} from '../../../../errors/AppError';
import {CategoriesRepositoryInMemory} from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import {CreateCategoryUseCase} from './CreateCategoryUseCase';

let categoryRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe('create category', () => {
    beforeEach(() => {
        categoryRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryInMemory);
    })

    it('should be able to create a new category', async () => {
        const category = {
            name: 'category test',
            description: 'category description test',
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        const categoryCreated = await categoryRepositoryInMemory.findByName(category.name);

        expect(categoryCreated).toHaveProperty('id');
    });

    it('should be not able to create a new category that name alredy exists', async () => {
        expect(async () => {
            const category = {
                name: 'category test',
                description: 'category description test',
            };

            await createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            });

            await createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
