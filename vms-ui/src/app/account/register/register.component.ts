import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/core/services/validate.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  telephone: string;
  errorMsg: string = "";
  successMsg: string = "";

  constructor(private validateService: ValidateService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onRegisterSubmit(): any{
    const user = {
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
