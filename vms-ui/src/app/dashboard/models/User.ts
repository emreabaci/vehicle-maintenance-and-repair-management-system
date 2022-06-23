export class User{
    id: string;
    name: string;
    email: string;
    telephone: string;
    username: string;
    password: string;
    role: string;

    constructor(initializer?:Partial<User>){
        if(initializer){
            Object.assign(this, initializer);
        }
    }
}