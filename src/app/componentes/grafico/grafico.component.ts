import { Component } from '@angular/core';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent {
  private labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];
  private data = {
    labels: this.labels, datasets:
      [{ label: '62480', data: [343, 253, 380, 297, 264, 276, 305, 301] },
      { label: '63028', data: [512, 298, 359, 334, 275, 305, 349, 332] },
      { label: '63644', data: [171, 258, 286, 244, 224, 236, 411, 429] },
      { label: '65196', data: [86, 56, 370, 177, 217, 221, 247, 272] },
      { label: '65660', data: [0, 0, 56, 83, 318, 221, 237, 415] },
      { label: '65673', data: [0, 14, 164, 202, 200, 235, 236, 226] },
      { label: '65674', data: [0, 0, 0, 45, 340, 325, 285, 310] },
      { label: '65678', data: [0, 0, 1, 17, 642, 1175, 1284, 1154] },
      { label: '65682', data: [54, 128, 120, 154, 124, 119, 281, 403] },
      { label: '65997', data: [0, 0, 0, 105, 376, 202, 271, 246] }]
  };
  private options = {
    scales: {
      y: {
        beginAtZero: true,
        display: true
      }
    }
  }
  // public config: ChartConfiguration = {
  //   type: 'radar',
  //   data: this.data,
  //   options: this.options

  // };


  // constructor() {

  // }
  // ngOnInit(): void {
  //   let chartItem: ChartItem = document.getElementById('myChart') as ChartItem
  //   Chart.register(...registerables);
  //   new Chart(chartItem, this.config);
  // }



}
