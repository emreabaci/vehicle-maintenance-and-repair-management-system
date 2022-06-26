import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/account/services/auth.service';
import { ValidateService } from 'src/app/core/services/validate.service';
import { Maintenance } from '../../models/Maintenance';
import { Record } from '../../models/Record';
import { User } from '../../models/User';
import { MaintenanceService } from '../services/maintenance.service';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-list-maintenances',
  templateUrl: './list-maintenances.component.html',
  styleUrls: ['./list-maintenances.component.scss']
})
export class ListMaintenancesComponent implements OnInit, OnDestroy, AfterViewInit {
  // Update Section
  updateMaintenanceModal: any;

  selectedMaintenance: Maintenance = new Maintenance();
  updateMaintenance: Maintenance = new Maintenance();
  allMaintenances: Maintenance[] = [];

  pageNo: number = 1;
  paginationConfig: any;
  @Input() plateNumber: string = "";
  @Input() debounceTime = 300;

  _plateNumber = "";
  deleteConfirmModal: any;
  deleteMaintenanceId: string = "";

  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );
  subscriptions: Subscription[] = [];

  errorMsg: string = "";
  successMsg: string = "";

  constructor(private maintenanceService: MaintenanceService, private validateService: ValidateService, private route: ActivatedRoute, private authService: AuthService) { 

  }

  get isAdmin(): boolean{
    return this.authService.isAdmin;
  }
  
  ngAfterViewInit(): void {
    this.deleteConfirmModal = document.getElementById('deleteConfirm');
    this.deleteConfirmModal?.addEventListener('show.bs.modal', (event: any) => {
      // Button that triggered the modal
      const button = event.relatedTarget;

      // Extract info from data-bs-* attributes
      this.deleteMaintenanceId = button.getAttribute('data-bs-whatever');
    });

    this.updateMaintenanceModal = document.getElementById('updateMaintenanceModal');
    this.updateMaintenanceModal?.addEventListener('hide.bs.modal', (event: any) => {
      console.warn("hide.bs.modal");
      //this.updateMaintenance = new Maintenance();
    });
  }

  ngOnInit(): void {
    const subscription = this.trigger.subscribe(currentValue => {
      this._plateNumber = currentValue;
      this.getAllMaintenances(this.pageNo, currentValue);
    });
    this.subscriptions.push(subscription);

    if(this.route.snapshot.paramMap.get('own')){ 
      this._plateNumber = this.authService.currentUser.username;
      this.plateNumber = this._plateNumber;
      this.getAllMaintenances(this.pageNo, this._plateNumber);
    } else {
      this.getAllMaintenances(this.pageNo);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  pageChanged(number: any){
    this.getAllMaintenances(number, this._plateNumber);
  }

  private getAllMaintenances(currentPage: number, searchByPlateNumber?: string, type?:number){
    this.maintenanceService.getAllMaintenances(currentPage, searchByPlateNumber, type).subscribe((data) => {
      if(data.success){
        this.pageNo = currentPage;
        this.allMaintenances = [];

        // Setting pagination config
        this.paginationConfig = {
          itemsPerPage: ITEMS_PER_PAGE,
          currentPage: currentPage,
          totalItems: data.count
        };

        for(let maintenance of data.maintenances){
          const _maintenance = new Maintenance({
            id: maintenance._id,
            type: maintenance.type,
            plateNumber: maintenance.plateNumber,
            createdAt: maintenance.createdAt,
            createdBy: new User({
              id: maintenance.createdBy._id,
              name: maintenance.createdBy.name,
              username: maintenance.createdBy.username
            })
          });

          for(let record of maintenance.records){
            _maintenance.records.push(new Record({
              id: record._id,
              description: record.description,
              price: record?.price
            }))
          }

          this.allMaintenances.push(_maintenance);
        }

        console.warn(this.allMaintenances);

      } else {
        this.showError(data.msg);
      }
    });
  }

  searchMaintenanceByPlateNumber(event: any){
    this.inputValue.next(event.target.value);
  }

  resetDeleteMaintenance(){
    this.deleteMaintenanceId = "";
  }

  deleteMaintenance(){
    console.warn("deleteMaintenance", this.deleteMaintenanceId);

    this.maintenanceService.deleteMaintenance(this.deleteMaintenanceId).subscribe((data) => {
      if(data.success){
        this.showSuccess("Deletion successful");
        this.getAllMaintenances(this.pageNo, this._plateNumber);
      } else {
        this.showError("Deletion failed");
      }
      this.resetDeleteMaintenance();
    });
  }

  changeAssignType(type: number){
    if(type == -1){
    // Get all
    this.getAllMaintenances(this.pageNo, this._plateNumber);
    } else if(type == 0){
      // Get maintenances
      this.getAllMaintenances(this.pageNo, this._plateNumber, type);
    } else if(type == 1){
      // Get repairs
      this.getAllMaintenances(this.pageNo, this._plateNumber, type);
    }
  }

  updateItem(){
    if(!this.validateService.validateUpdateMaintenance(this.updateMaintenance)){
      this.showError('Can not be empty plate number and description fields');
      return;
    }

    for(let i = 0; i < this.updateMaintenance.records.length; i++){
      if(this.selectedMaintenance.records[i].description != this.updateMaintenance.records[i].description){
        this.updateMaintenance.records[i].isUpdated = true;
      }
    }

    this.maintenanceService.updateMaintenance(this.updateMaintenance).subscribe((data) => {
        if(data.success){
          for(let maintenance of this.allMaintenances){
            if(maintenance.id == this.updateMaintenance.id){
              maintenance.plateNumber = this.updateMaintenance.plateNumber;
              maintenance.type = this.updateMaintenance.type;
              maintenance.records = this.updateMaintenance.records;
              break;
            }
          }
          this.showSuccess('Update successful');
          console.warn(this.allMaintenances);
        } else {
          this.showError('Update failed');
        }
      });
  }

  selectMaintenance(maintenance: Maintenance){
    this.selectedMaintenance = maintenance;
    this.updateMaintenance = new Maintenance(JSON.parse(JSON.stringify(maintenance)));
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
