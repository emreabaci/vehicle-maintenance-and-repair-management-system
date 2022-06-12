import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/account/services/auth.service';
import { Maintenance } from '../../models/Maintenance';
import { VehicleAssignType } from '../../models/vehicle-assign-type';
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
  vehicleAssignType: VehicleAssignType = VehicleAssignType.MAINTENANCE;

  errorMsg: string = "";
  successMsg: string = "";

  constructor(private maintenanceService: MaintenanceService, private authService: AuthService) { }

  changeAssignType(type: number){
    if(type == VehicleAssignType.MAINTENANCE){
      this.vehicleAssignType = VehicleAssignType.MAINTENANCE;
    } else if(type == VehicleAssignType.REPAIR){
      this.vehicleAssignType = VehicleAssignType.REPAIR;
    }
  }

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
    this.maintenanceService.createMaintenance(this.vehicleAssignType, this.authService.currentUser.id, this.plateNumber, this.maintenancesFormItems).subscribe((data) => {
      if(data.success){
        this.showSuccess("Maintenance is saved");
        this.clearAll();
        this.clearPlateNumber();
      } else {
        this.showError("Something went wrong");
      }
    })
  }

  private showError(message: string){
    this.errorMsg = message;

    setTimeout(() => {
      this.errorMsg = "";
    }, 3000);
  }

  private showSuccess(message: string){
    this.successMsg = message;

    setTimeout(() => {
      this.successMsg = "";
    }, 3000);
  }
}
