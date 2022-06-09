import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ListMaintenancesComponent } from './maintenance/list-maintenances/list-maintenances.component';
import { AddRepairComponent } from './repair/add-repair/add-repair.component';
import { ListRepairComponent } from './repair/list-repair/list-repair.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {
      path: 'maintenance/add',
      component: AddMaintenanceComponent
    },
    {
      path: 'maintenance/list',
      component: ListMaintenancesComponent
    },
    {
      path: 'repair/add',
      component: AddRepairComponent
    },
    {
      path: 'repair/list',
      component: ListRepairComponent
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
