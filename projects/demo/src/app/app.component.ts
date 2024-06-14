import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxRangeDateSelectComponent } from 'ngx-range-date-select';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxRangeDateSelectComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
}
