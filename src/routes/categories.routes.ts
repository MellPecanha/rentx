import {Router} from 'express';
import multer from 'multer';

import {ListCategoriesController} from '../modules/cars/useCases/listCategories/ListCategoriesController';
import {ImportCategoryController} from '../modules/cars/useCases/importCategory/importCategoryController';
import {CreateCategoryController} from '../modules/cars/useCases/createCategory/CreateCategoryController';

const categoriesRoutes = Router();

const upload = multer({
    dest: './tmp',
});

const createCategoryController = new CreateCategoryController();

const importCategoryController = new ImportCategoryController();

const listCategoriesController = new ListCategoriesController();

categoriesRoutes.post('/', createCategoryController.handle);

categoriesRoutes.get('/', listCategoriesController.handle);

categoriesRoutes.post('/import', upload.single('file'), importCategoryController.handle);

export {categoriesRoutes};
