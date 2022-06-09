import { Component, OnInit } from '@angular/core';
import { AuthService } from '../account/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  get isUserLoggedIn(): boolean{
    return this.authService.loggedIn;
  }

  get username(){
    return this.authService.currentUser?.name;
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout();
  }

}
