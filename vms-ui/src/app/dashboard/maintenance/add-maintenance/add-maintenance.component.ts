import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/account/services/auth.service';
import { Maintenance } from '../../models/Maintenance';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent{
  plateNumber: string = ""
  newMaintenanceDescription: string = "";
  maintenancesFormItems: Maintenance[] = [];


  constructor(private maintenanceService: MaintenanceService, private authService: AuthService) { }

  addMaintenance(){
    if(this.newMaintenanceDescription == "") return;

    const _data = this.newMaintenanceDescription;
    this.maintenancesFormItems.push(new Maintenance(_data));
    this.newMaintenanceDescription = "";
  }

  deleteMaintenance(index: number){
    this.maintenancesFormItems.splice(index, 1);
  }

  clearPlateNumber(){
    if(this.maintenancesFormItems.length > 0) return;
    this.plateNumber = "";
  }

  clearAll(){
    this.maintenancesFormItems = [];
  }

  onAddMaintenanceSubmit(){
    this.maintenanceService.createMaintenance(this.authService.currentUser.id, this.plateNumber, this.maintenancesFormItems).subscribe((data) => {
      console.warn("onAddMaintenanceSubmit ", data);
      /*if(data.success){
        this.showSuccess("User is registered");
      } else {
        this.showError("Something went wrong");
      }*/
    })
  }
}
