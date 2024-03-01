import { Component,  OnInit, ViewChild, ElementRef} from '@angular/core';
import 'anychart';
/*import * as anychart from 'anychart';*/

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})


export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    // Create a chart
    let chart = anychart.column([
      ['Chocolate', 5],
      ['Vanilla', 3],
      ['Strawberry', 2]
    ]);

    // Set the chart title
    chart.title('Ice Cream Sales');

    // Render the chart
    chart.container('container');
    chart.draw();
  }


}
