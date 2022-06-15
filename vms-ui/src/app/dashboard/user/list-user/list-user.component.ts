import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ValidateService } from 'src/app/core/services/validate.service';
import { UserService } from '../service/user.service';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, AfterViewInit {
  allUsers: any[] = [];
  pageNo: number = 1;

  // Update Section
  updateUserModal: any;

  updateUserItem = {
    id: "",
    role: "",
    name: "",
    username: "",
    email: "",
    telephone: ""
  };

  // Delete Section
  deleteConfirmModal: any;
  deleteUserId: string = "";

  @Input() usernameOrPlateNumber: string = "";
  @Input() debounceTime = 300;

  paginationConfig: any;

  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );
  subscriptions: Subscription[] = [];

  errorMsg: string = "";
  successMsg: string = "";

  constructor(private usersService: UserService, private validateService: ValidateService) { }

  ngOnInit(): void {
    const subscription = this.trigger.subscribe(currentValue => {
      this.usernameOrPlateNumber = currentValue;
      this.getAllUsers(this.pageNo, currentValue);
    });

    this.subscriptions.push(subscription);
    this.getAllUsers(this.pageNo);
  }

  ngAfterViewInit(): void {
    this.deleteConfirmModal = document.getElementById('deleteConfirm');
    this.deleteConfirmModal?.addEventListener('show.bs.modal', (event: any) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      this.deleteUserId = button.getAttribute('data-bs-id');
    });

    this.updateUserModal = document.getElementById('updateModal');
    this.updateUserModal?.addEventListener('show.bs.modal', (event: any) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      this.updateUserItem.id = button.getAttribute('data-bs-id');
      this.updateUserItem.role = button.getAttribute('data-bs-role');
      this.updateUserItem.name = button.getAttribute('data-bs-name');
      this.updateUserItem.username = button.getAttribute('data-bs-username');
      this.updateUserItem.email = button.getAttribute('data-bs-email');
      this.updateUserItem.telephone = button.getAttribute('data-bs-telephone');
    });

  }

  private getAllUsers(currentPage: number, searchByPlateNumber?: string, role?:string) {
    this.usersService.getAllUsers(currentPage, searchByPlateNumber, role).subscribe((data) => {
      if(data.success){
        this.pageNo = currentPage;
        this.allUsers = [];

        // Setting pagination config
        this.paginationConfig = {
          itemsPerPage: ITEMS_PER_PAGE,
          currentPage: currentPage,
          totalItems: data.count
        };

        for(let user of data.users){
          const _user = {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            telephone: user.telephone,
            username: user.username,
            createdAt: user.createdAt
          }

          this.allUsers.push(_user);
        }

      } else {
        this.showError(data.msg);
      }
    });
  }

  filterByRole(role:string){
    if(role == 'all'){
      this.getAllUsers(this.pageNo, this.usernameOrPlateNumber)
    } else if(role == 'admin'){
      this.getAllUsers(this.pageNo, this.usernameOrPlateNumber, role);
    } else if(role == 'user'){
      this.getAllUsers(this.pageNo, this.usernameOrPlateNumber, role);
    }
  }

  pageChanged(number: any){
    this.getAllUsers(number, this.usernameOrPlateNumber);
  }

  searchUsernameOrPlateNumber(event:any){
    this.inputValue.next(event.target.value);
  }

  resetDeleteUser(){
    this.deleteUserId = "";
  }

  deleteUser(){
    this.usersService.deleteUser(this.deleteUserId).subscribe((data) => {
      if(data.success){
        this.showSuccess("Deletion successful");
        this.getAllUsers(this.pageNo, this.usernameOrPlateNumber);
      } else {
        this.showError("Deletion failed");
      }

      this.resetDeleteUser();
    });
  }

  updateUser(){
    if(!this.validateService.validateUpdateUser(
      this.updateUserItem.name, 
      this.updateUserItem.username,
      this.updateUserItem.email,
      this.updateUserItem.telephone
      )){
        this.showError('Can not be empty name, username, email and telephone fields');
        return;
      }
      
      this.usersService.updateUser(
        this.updateUserItem.id, 
        this.updateUserItem.role,
        this.updateUserItem.name,
        this.updateUserItem.username,
        this.updateUserItem.email,
        this.updateUserItem.telephone
      ).subscribe((data) => {
        if(data.success){
          for(let user of this.allUsers){
            if(user.id == this.updateUserItem.id){
              user.role = this.updateUserItem.role;
              user.name = this.updateUserItem.name;
              user.username = this.updateUserItem.username;
              user.email = this.updateUserItem.email;
              user.telephone = this.updateUserItem.telephone;
              break;
            }
          }
          this.showSuccess('update successful');
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
