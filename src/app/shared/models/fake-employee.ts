import { uuid } from './uuid';
import * as faker from 'faker';
export class FakeEmployee {
    id: string;
    firstName: string;
    profession: string;
    department: string;
    public static create(): FakeEmployee {
        let newObj = new FakeEmployee();
        newObj.id = uuid.generate();
        newObj.firstName = faker.name.firstName(0);
        newObj.firstName = faker.name.lastName(0);
        newObj.department = faker.commerce.department.name;
        return newObj;
    }

    public static createNEmployees(n: number): FakeEmployee[] {

        const list: FakeEmployee[] = [];
        for (let index = 0; index < n; index++) {

            let newObj = new FakeEmployee();
            newObj.id = uuid.generate();
            newObj.firstName = faker.name.firstName(0);
            newObj.firstName = faker.name.lastName(0);
            newObj.department = faker.commerce.department.name;
            list.push(newObj);
        }
        return list;    
    }
}
