import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ListMaintenancesComponent } from './maintenance/list-maintenances/list-maintenances.component';
import { AddRepairComponent } from './repair/add-repair/add-repair.component';
import { ListRepairComponent } from './repair/list-repair/list-repair.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListMaintenancesComponent,
    AddRepairComponent,
    ListRepairComponent,
    AddMaintenanceComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
