import {SpecificationsRepository} from '../repositories/SpecificationsRepository';

interface IRequest {
    name: string;
    description: string;
}
class CreateSpecificationService {
    constructor(private specificationsRepository: SpecificationsRepository) {}

    execute({name, description}: IRequest): void {
        const specificationAlreadyExists = this.specificationsRepository.findByName(name);

        if(specificationAlreadyExists) {
            throw new Error(`Specification ${name} already exists!`);
        }

        this.specificationsRepository.create({name, description});
    }
}

export {CreateSpecificationService}
