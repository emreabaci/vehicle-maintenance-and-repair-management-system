import { Record } from "./Record";
import { User } from "./User";
import { VehicleAssignType } from "./vehicle-assign-type";

export class Maintenance{
    id: string;
    type: VehicleAssignType = VehicleAssignType.MAINTENANCE;
    createdBy: User;
    plateNumber: string;
    records: Record[] = [];
    createdAt: string;
    
    constructor(initializer?: Partial<Maintenance>){
        if(initializer){
            Object.assign(this, initializer);
        }
    }
}