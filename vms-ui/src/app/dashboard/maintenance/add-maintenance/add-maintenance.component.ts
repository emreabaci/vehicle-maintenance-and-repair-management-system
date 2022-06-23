import { Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';
import { Maintenance } from '../../models/Maintenance';
import { Record } from '../../models/Record';
import { VehicleAssignType } from '../../models/vehicle-assign-type';
import { UserService } from '../../user/service/user.service';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent implements OnInit{
  searchUsers: any[] = [];
  newMaintenance: Maintenance = new Maintenance();
  newRecord: Record = new Record();

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

  get newMaintenanceObj(): string{
    return JSON.stringify(this.newMaintenance);
  }

  changeAssignType(type: number){
    if(type == VehicleAssignType.MAINTENANCE){
      this.newMaintenance.type = VehicleAssignType.MAINTENANCE;
    } else if(type == VehicleAssignType.REPAIR){
      this.newMaintenance.type = VehicleAssignType.REPAIR;
    }
  }

  addRecord(){
    if(this.newRecord.description == "") return;

    this.newMaintenance.records.push(this.newRecord);
    this.newRecord = new Record();
  }

  deleteMaintenance(index: number){
    this.newMaintenance.records.splice(index, 1);
  }

  clearPlateNumber(){
    if(this.newMaintenance.records.length > 0) return;
    this.plateNumber = "";
  }

  clearAll(){
    this.newMaintenance.records = [];
  }

  onAddMaintenanceSubmit(){
    this.maintenanceService.createMaintenance(this.authService.currentUser.id, this.newMaintenance).subscribe((data) => {
      if(data.success){
        this.showSuccess("Maintenance is saved");
        this.clearAll();
        this.clearPlateNumber();
      } else {
        this.showError("Something went wrong");
      }
    });
  }

  searchByPlateNumber(event: any){
    this.inputValue.next(event.target.value);
  }

  selectedLiveSearch(data: any){
    this.newMaintenance.plateNumber = data.username;
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
