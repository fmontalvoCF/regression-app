import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  valorM = 0;
  valorB = 0;
  newX: number = 0;
  newY: number = 0;
  points: { x: number; y: number }[] = [];
  data: any;
  options: any = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'X Axis',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Axis',
        },
      },
    },
  };

  sumX: number = 0;
  sumY: number = 0;
  mse: number = 0;
  rmse: number = 0;
  rSquared: number = 0;
  mae: number = 0;

  constructor() {
    this.initializeChart();
  }

  initializeChart() {
    this.data = {
      datasets: [
        {
          label: 'Puntos',
          data: this.points,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointRadius: 5,
        },
        {
          label: 'Línea (y = mx + b)',
          data: this.getLineData(), // Datos de la línea
          type: 'line',
          fill: false,
          borderColor: 'rgba(255,0,0,1)',
          borderWidth: 2,
        },
      ],
    };
  }

  agregarPunto() {
    if (this.newX != null && this.newY != null) {
      this.points.push({ x: this.newX, y: this.newY });
      this.updateChart();
      this.updateMetrics()
      console.log(this.points);
    }
  }

  getLineData() {
    const minX = Math.min(...this.points.map((p) => p.x), 0);
    const maxX = Math.max(...this.points.map((p) => p.x), 10);
    const minY = this.valorM * minX + this.valorB;
    const maxY = this.valorM * maxX + this.valorB;
    return [
      { x: minX, y: minY },
      { x: maxX, y: maxY },
    ];
  }

  updateChart() {
    this.data = {
      datasets: [
        {
          label: 'Puntos',
          data: [...this.points],
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointRadius: 5,
        },
        {
          label: 'Línea (y = mx + b)',
          data: this.getLineData(),
          type: 'line',
          fill: false,
          borderColor: 'rgba(255,0,0,1)',
          borderWidth: 2,
        },
      ],
    };
  }

  updateMetrics() {
    const n = this.points.length;
    if (n === 0) return;

    this.sumX = this.points.reduce((acc, p) => acc + p.x, 0);
    this.sumY = this.points.reduce((acc, p) => acc + p.y, 0);
    const meanY = this.sumY / n;

    let sumSquaredErrors = 0;
    let sumSquaredTotal = 0;
    let sumAbsoluteErrors = 0;

    this.points.forEach(p => {
      const valueLineY = this.valorM * p.x + this.valorB;
      const error = p.y - valueLineY;
      sumSquaredErrors += error * error;
      sumSquaredTotal += (p.y - meanY) * (p.y - meanY);
      sumAbsoluteErrors += Math.abs(error);
    });

    this.mse = sumSquaredErrors / n;
    this.rmse = Math.sqrt(this.mse);
    this.rSquared = 1 - (sumSquaredErrors / sumSquaredTotal);
    this.mae = sumAbsoluteErrors / n;
  }
}
