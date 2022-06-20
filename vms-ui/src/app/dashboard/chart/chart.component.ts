import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from './service/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  errorMsg: string = "";
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Statistics
  allUserCount = 0;
  allMaintenanceCount = 0;
  allRepairCount = 0;

// Pie
public pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  }
};
public pieChartData: ChartData<'pie', number[], string | string[]> = {
  labels: [ [ 'Users Count'], [ 'Maintenance Count' ], [ 'Repair Count' ]],
  datasets: [ {
    data: [ this.allUserCount, this.allMaintenanceCount, this.allRepairCount ]
  } ]
};
public pieChartType: ChartType = 'pie';


// events
public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
  console.log(event, active);
}

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  private getStatistics(){
    this.chartService.getStatistics().subscribe((data) => {
      if(data.success){
        //totalUser
        this.allUserCount = data.totalUser;
        //totalRepairs
        this.allRepairCount = data.totalRepairs;
        //totalMaintenances
        this.allMaintenanceCount = data.totalMaintenances;

       this.pieChartData.datasets[0].data = [this.allUserCount, this.allMaintenanceCount, this.allRepairCount]
       this.chart?.update();
      } else {
        this.showError("Error occured getStatistics");
      }
    });
  }

  private showError(message: string){
    this.errorMsg = message;

    setTimeout(() => {
      this.errorMsg = "";
    }, 3000);
  }
}
