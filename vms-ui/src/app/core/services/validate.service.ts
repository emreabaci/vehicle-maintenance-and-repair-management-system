import { Injectable } from '@angular/core';
import { Maintenance } from 'src/app/dashboard/models/Maintenance';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user: any){
    if(user.name == undefined || user.username == undefined || user.email == undefined || 
       user.telephone == undefined || user.password == undefined || user.confirmPassword == undefined){
        return false;
      } else {
        return true;
      }
  }

  validateEmail(email: any) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateConfirmPassword(password: string, confirmPassword: string){
    return password == confirmPassword;
  }

  validateAddMaintenance(plateNumber: string, maintenances: Maintenance[]){
    if(plateNumber == "" || maintenances.length == 0 ){
      return false;
    } else {
      return true;
    }
  }

  validateUpdateMaintenance(plateNumber: string, description: string){
    if(plateNumber == "" || description == ""){
      return false;
    } else {
      return true;
    }
  }
}
