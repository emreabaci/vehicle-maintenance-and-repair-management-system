import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { DashboardComponent } from './dashboard.component';
import { AddMaintenanceComponent } from './maintenance/add-maintenance/add-maintenance.component';
import { ListMaintenancesComponent } from './maintenance/list-maintenances/list-maintenances.component';
import { ViewComponent } from './profile/view/view.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { ListUserComponent } from './user/list-user/list-user.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {
      path: 'user/add',
      component: AddUserComponent
    },
    {
      path: 'user/list',
      component: ListUserComponent
    },
    {
      path: 'maintenance/add',
      component: AddMaintenanceComponent
    },
    {
      path: 'maintenance/list',
      component: ListMaintenancesComponent
    },
    {
      path: 'profile/view',
      component: ViewComponent
    },
    {
      path: 'chart',
      component: ChartComponent
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
