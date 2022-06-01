import {CategoriesRepository} from '../../repositories/implementations/CategoriesRepository';
import {ImportCategoryUseCase} from './importCategoryUseCase';
import {ImportCategoryController} from './importCategoryController';

const categoriesRepository = CategoriesRepository.getInstance();
const importCategoryUseCase = new ImportCategoryUseCase(categoriesRepository);
const importCategoryController = new ImportCategoryController(importCategoryUseCase);

export {importCategoryController};
