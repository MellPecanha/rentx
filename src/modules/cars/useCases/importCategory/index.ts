import {ImportCategoryUseCase} from './importCategoryUseCase';
import {ImportCategoryController} from './importCategoryController';

const importCategoryUseCase = new ImportCategoryUseCase();
const importCategoryController = new ImportCategoryController(importCategoryUseCase);

export {importCategoryController};
