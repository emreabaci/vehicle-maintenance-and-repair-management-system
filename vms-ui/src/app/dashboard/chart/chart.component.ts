import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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
    data: [ 300, 500, 300 ]
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

  constructor() { }

  ngOnInit(): void {

  }
}
