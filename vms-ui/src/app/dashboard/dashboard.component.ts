import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
  }

  signOut(){
    this.router.navigate([ '/home' ])
  }

}
