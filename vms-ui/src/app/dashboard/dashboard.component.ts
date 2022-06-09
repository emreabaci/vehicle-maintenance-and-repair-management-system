import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from './models/page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  activePage : string;
  ea: string;

  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    const _activePage = localStorage.getItem('active_page');

    if(_activePage){
      this.activePage = _activePage;
    }
  }

  signOut(){
    this.router.navigate([ '/home' ])
  }

  openPage(page: string){
    switch(page){
      case Page.MAINTENANCE:
        this.activePage = Page.MAINTENANCE;
      break;
      case Page.REPAIR:
        this.activePage = Page.REPAIR;
        break;
    }

    localStorage.setItem('active_page', this.activePage);
  }

}
