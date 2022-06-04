import {inject, injectable} from 'tsyringe';
import {SpecificationsRepository} from '../../repositories/implementations/SpecificationsRepository';

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationUseCase {
    constructor(
        @inject('SpecificationsRepository')
        private specificationsRepository: SpecificationsRepository
    ) {}

    execute({name, description}: IRequest): void {
        const specificationAlreadyExists = this.specificationsRepository.findByName(name);

        if(specificationAlreadyExists) {
            throw new Error(`Specification ${name} already exists!`);
        }

        this.specificationsRepository.create({name, description});
    }
}

export {CreateSpecificationUseCase};
