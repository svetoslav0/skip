import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { IRepository } from "../../repositories/IRepository";
import { database } from "../../server";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";

@ValidatorConstraint({async: true})
export class IsResourceIdExisting implements ValidatorConstraintInterface {
    validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async resolve => {
            if (!id) {
                resolve(true);
            }

            const repositoryType: string = validationArguments?.constraints[0];
            const repository: IRepository = new RepositoryFactory()
                .createRepository(repositoryType, database);

            const result = await repository.findById(id);

            resolve(!!result);
        });
    }
}
