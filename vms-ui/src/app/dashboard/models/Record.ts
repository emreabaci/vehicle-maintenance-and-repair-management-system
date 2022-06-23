import { User } from "./User";

export class Record{
    id: string;
    description: string;
    price: number;
    owner: User;
    isUpdated?: boolean;

    constructor(initializer?:Partial<Record>){
        if(initializer){
            Object.assign(this, initializer);
        }
    }
}