import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ListMaintenancesComponent } from './maintenance/list-maintenances/list-maintenances.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { ViewComponent } from './profile/view/view.component';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListMaintenancesComponent,
    AddMaintenanceComponent,
    ListUserComponent,
    AddUserComponent,
    ViewComponent,
    ChartComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
