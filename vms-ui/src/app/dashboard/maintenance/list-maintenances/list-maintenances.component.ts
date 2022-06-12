import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ValidateService } from 'src/app/core/services/validate.service';
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

  updateMaintenanceItem = {
    id: "",
    plateNumber: "",
    type: 0,
    description: ""
  };

  allMaintenances: any[] = [];
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

  constructor(private maintenanceService: MaintenanceService, private validateService: ValidateService) { 

  }
  
  ngAfterViewInit(): void {
    this.deleteConfirmModal = document.getElementById('deleteConfirm');
    this.deleteConfirmModal?.addEventListener('show.bs.modal', (event: any) => {
      // Button that triggered the modal
      const button = event.relatedTarget;

      // Extract info from data-bs-* attributes
      this.deleteMaintenanceId = button.getAttribute('data-bs-whatever');
    });

    this.updateMaintenanceModal = document.getElementById('updateModal');
    this.updateMaintenanceModal?.addEventListener('show.bs.modal', (event: any) => {
      // Button that triggered the modal
      const button = event.relatedTarget;

      // Extract info from data-bs-* attributes
      this.updateMaintenanceItem.id = button.getAttribute('data-bs-id');
      this.updateMaintenanceItem.type = button.getAttribute('data-bs-type');
      this.updateMaintenanceItem.description = button.getAttribute('data-bs-description');
      this.updateMaintenanceItem.plateNumber = button.getAttribute('data-bs-plateNumber');
    });
  }

  ngOnInit(): void {
    const subscription = this.trigger.subscribe(currentValue => {
      this._plateNumber = currentValue;
      this.getAllMaintenances(this.pageNo, currentValue);
    });
    this.subscriptions.push(subscription);

    this.getAllMaintenances(this.pageNo);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  pageChanged(number: any){
    this.getAllMaintenances(number, this._plateNumber);
  }

  getAllMaintenances(currentPage: number, searchByPlateNumber?: string, type?:number){
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
          const _maintenance = {
            id: maintenance._id,
            type: maintenance.type,
            plateNumber: maintenance.plateNumber,
            createdByName: maintenance.createdBy.name,
            description: maintenance.description,
            createdAt: maintenance.createdAt
          }

          this.allMaintenances.push(_maintenance);
        }
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
    if(!this.validateService.validateUpdateMaintenance(this.updateMaintenanceItem.plateNumber, this.updateMaintenanceItem.description)){
      this.showError('Can not be empty plate number and description fields');
      return;
    }

    this.maintenanceService.updateMaintenance(
      this.updateMaintenanceItem.id, 
      this.updateMaintenanceItem.type, 
      this.updateMaintenanceItem.plateNumber, 
      this.updateMaintenanceItem.description).subscribe((data) => {
        if(data.success){
          for(let maintenance of this.allMaintenances){
            if(maintenance.id == this.updateMaintenanceItem.id){
              maintenance.type = this.updateMaintenanceItem.type;
              maintenance.plateNumber = this.updateMaintenanceItem.plateNumber;
              maintenance.description = this.updateMaintenanceItem.description;
              break;
            }
          }
          this.showSuccess('Update successful');
        } else {
          this.showError('Update failed');
        }
      });
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
