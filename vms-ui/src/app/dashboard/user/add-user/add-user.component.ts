import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/account/services/auth.service';
import { ValidateService } from 'src/app/core/services/validate.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  role: string = "admin";
  name: string = ""
  username: string = ""
  email: string = ""
  password: string = ""
  confirmPassword: string = ""
  telephone: string = ""
  errorMsg: string = "";
  successMsg: string = "";

  constructor(private validateService: ValidateService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onRegisterSubmit(): any{
    const user = {
      role: this.role,
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      telephone: this.telephone
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.showError("Please fill in all fields");
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.showError("Please use a valid email");
      return false;
    }

    // Validate password and confirm password
    if(!this.validateService.validateConfirmPassword(user.password, user.confirmPassword)){
      this.showError("Must equal password and confirm password");
      return;
    }

    // Register User
    this.authService.registerUser(user).subscribe((data) => {
      if(data.success){
        this.showSuccess("User is registered");
        this.clearForm();
      } else {
        this.showError("Something went wrong");
      }
    })
  }

  clearForm(){
    this.role = "admin";
    this.name = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.telephone= "";
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
