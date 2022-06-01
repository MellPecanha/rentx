import fs from 'fs';
import {parse as csvParse} from 'csv-parse';
import {ICategoriesRepository} from '../../repositories/ICategoriesRepository';

interface IImportCategory {
    name: string;
    description: string;
}

class ImportCategoryUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    loadCategories(file: Express.Multer.File): Promise<IImportCategory> {
        return new Promise((res, rej) => {
            const stream = fs.createReadStream(file.path);
            const categories: IImportCategory[] = [];

            const parseFile = csvParse();

            stream.pipe(parseFile);

            parseFile
                .on('data', async (line) => {
                    const [name, description] = line;
                    categories.push({name, description});
                })
                .on('end', () => {
                    res(categories);
                })
                .on('error', (err) => {
                    rej(err);
                })
    });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);
        console.log(categories);
    }
}

export {ImportCategoryUseCase};
