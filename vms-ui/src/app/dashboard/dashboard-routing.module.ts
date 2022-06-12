import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ListMaintenancesComponent } from './maintenance/list-maintenances/list-maintenances.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {
      path: 'maintenance/add',
      component: AddMaintenanceComponent
    },
    {
      path: 'maintenance/list',
      component: ListMaintenancesComponent
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
