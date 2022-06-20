import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';
import { Maintenance } from '../../models/Maintenance';
import { VehicleAssignType } from '../../models/vehicle-assign-type';
import { UserService } from '../../user/service/user.service';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent implements OnInit{
  //plateNumber: string = ""
  newMaintenanceDescription: string = "";
  maintenancesFormItems: Maintenance[] = [];
  searchUsers: any[] = [];
  vehicleAssignType: VehicleAssignType = VehicleAssignType.MAINTENANCE;

  errorMsg: string = "";
  successMsg: string = "";

  // Live search
  @Input() plateNumber: string = "";
  @Input() debounceTime = 300;
  
  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );
  subscriptions: Subscription[] = [];
  showEmptyItem = false;

  constructor(private maintenanceService: MaintenanceService, private authService: AuthService, private usersService: UserService) { }
  
  ngOnInit(): void {
    const subscription = this.trigger.subscribe(currentValue => {
      if(currentValue.length > 2){
        this.usersService.getAllUsers(1, currentValue, "user").subscribe((data) => {
            if(data.success){
              this.searchUsers = [];
              for(let user of data.users){      
                this.searchUsers.push({
                  username: user.username
                });
              }

              if(this.searchUsers.length == 0){
                this.showEmptyItem = true;
              }
            }
        })
      } else {
        this.searchUsers = [];
        this.showEmptyItem = false;
      }
    });
    this.subscriptions.push(subscription);
  }

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

  searchByPlateNumber(event: any){
    this.inputValue.next(event.target.value);
  }

  selectedLiveSearch(data: any){
    this.plateNumber = data.username;
    this.searchUsers = [];
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
