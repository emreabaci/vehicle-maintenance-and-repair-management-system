import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/account/services/auth.service';
import { ValidateService } from 'src/app/core/services/validate.service';
import { UserService } from '../../user/service/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  errorMsg: string = "";
  successMsg: string = "";

  updateUserItem = {
    id: "",
    role: "",
    name: "",
    username: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: ""
  };

  constructor(private authService: AuthService, private validateService: ValidateService, private userService: UserService) { }

  ngOnInit(): void {
    console.warn(this.authService.currentUser);

    this.updateUserItem.id = this.authService.currentUser.id;
    this.updateUserItem.role = this.authService.currentUser.role;
    this.updateUserItem.name = this.authService.currentUser.name;
    this.updateUserItem.username = this.authService.currentUser.username;
    this.updateUserItem.email = this.authService.currentUser.email;
    this.updateUserItem.telephone = this.authService.currentUser.telephone;
  }

  onUpdateSubmit(){
    if(!this.validateService.validateUpdateUser(
      this.updateUserItem.name, 
      this.updateUserItem.username,
      this.updateUserItem.email,
      this.updateUserItem.telephone)){
        this.showError('Can not be empty name, username/plate number, email and telephone fields');
        return;
      }

      if(!this.validateService.validateEmail(this.updateUserItem.email)){
        this.showError("Please use a valid email");
        return;
      }

      if(!this.validateService.validateConfirmPassword(this.updateUserItem.password, this.updateUserItem.confirmPassword)){
        this.showError("Must equal password and confirm password");
        return;
      }

      this.userService.updateUser(
        this.updateUserItem.id,
        this.updateUserItem.role,
        this.updateUserItem.name,
        this.updateUserItem.username,
        this.updateUserItem.email,
        this.updateUserItem.telephone,
        this.updateUserItem.password
      ).subscribe((data) => {
        if(data.success){
          this.showSuccess('update successful');          
        } else {
          this.showError('Update failed');

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
