import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

interface DateRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'ngx-range-date-select',
  standalone: true,
  imports: [FormsModule, NgbDatepickerModule],
  template: `
    <div>
      <form class="row row-cols-sm-auto">
        <div class="col-12">
          <div class="input-group">
            <select
              name="typeRange"
              class="form-select"
              [(ngModel)]="typeRange"
              (ngModelChange)="onSelectRange($event)"
            >
              <option value="seleccionar">Seleccionar Periodo</option>
              <option value="custom">Rango Manual</option>
              <option disabled>--------------------------------</option>
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="fromYesterday">Desde Ayer</option>
              <option value="fromWeekToNow">Esta Semana hasta la fecha</option>
              <option value="fromMonthToNow">Este Mes hasta la fecha</option>
              <option value="fromYearToNow">Este Año hasta la fecha</option>
              <option disabled>--------------------------------</option>
              <option value="lastWeek">Última Semana</option>
              <option value="lastTwoWeek">Últimas 2 Semanas</option>
              <option value="lastMonth">Último Mes</option>
              <option value="lastYear">Último Año</option>
              <option disabled>--------------------------------</option>
              <option value="last7Days">Últimos 7 Días</option>
              <option value="last15Days">Últimos 15 Días</option>
              <option value="last30Days">Últimos 30 Días</option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="dp-hidden position-absolute">
            <div class="input-group">
              <input
                [disabled]="!isCustomRange"
                name="datepicker"
                class="form-control"
                ngbDatepicker
                #datepicker="ngbDatepicker"
                [autoClose]="'outside'"
                (dateSelect)="onDateSelection($event)"
                [displayMonths]="2"
                [dayTemplate]="t"
                outsideDays="hidden"
                [startDate]="fromDate!"
                tabindex="-1"
              />
              <ng-template #t let-date let-focused="focused">
                <span
                  class="custom-day"
                  [class.focused]="focused"
                  [class.range]="isRange(date)"
                  [class.faded]="isHovered(date) || isInside(date)"
                  (mouseenter)="hoveredDate = date"
                  (mouseleave)="hoveredDate = null"
                >
                  {{ date.day }}
                </span>
              </ng-template>
            </div>
          </div>
          <div class="input-group">
            <input
              [disabled]="!isCustomRange"
              #dpFromDate
              class="form-control"
              placeholder="yyyy-mm-dd"
              name="dpFromDate"
              [value]="formatter.format(fromDate)"
              (input)="fromDate = validateInput(fromDate, dpFromDate.value)"
            />
            <button
              class="btn btn-outline-secondary bi bi-calendar3"
              (click)="datepicker.toggle()"
              type="button"
            ></button>
          </div>
        </div>
        <span
          class="d-flex justify-content-center align-content-center align-items-center text-center "
          >- a -</span
        >
        <div class="col-12">
          <div class="input-group">
            <input
              [disabled]="!isCustomRange"
              #dpToDate
              class="form-control"
              placeholder="yyyy-mm-dd"
              name="dpToDate"
              [value]="formatter.format(toDate)"
              (input)="toDate = validateInput(toDate, dpToDate.value)"
            />
            <button
              class="btn btn-outline-secondary bi bi-calendar3"
              (click)="datepicker.toggle()"
              type="button"
            ></button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: `
  .dp-hidden {
    width: 0;
    margin: 0;
    border: none;
    padding: 0;
  }
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.focused {
    background-color: #e6e6e6;
  }
  .custom-day.range,
  .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
`,
})
export class NgxRangeDateSelectComponent {
  @Output() rangeDateOut: EventEmitter<DateRange> =
    new EventEmitter<DateRange>();

  rangeDate: DateRange = {
    startDate: '',
    endDate: '',
  };

  //************* Atributos de selección *************/
  isCustomRange: boolean = false;
  typeRange: string = 'today';

  //************* Atributos de selección de componente *************/

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    'd',
    10
  );

  emitRangeDate() {
    this.rangeDateOut.emit(this.rangeDate);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.rangeDate.startDate = moment(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day)
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    this.rangeDate.endDate = moment(this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day)
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');

    this.emitRangeDate();
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  onChange(event: any) {
    //Setear las horas a 00:00:00
    this.rangeDate.startDate = moment(event[0])
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    this.rangeDate.endDate = moment(event[1])
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');

    // console.log(this.rangeDate.startDate, this.rangeDate.endDate);
  }

  onSelectRange(event: any) {
    const range = event;
    const now = moment(); // Fecha y hora actual del sistema
    const todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    this.isCustomRange = range === 'custom' ? true : false;

    this.typeRange = range;
    // console.log('Tipo de Rango', this.typeRange);

    switch (range) {
      case 'yesterday':
        this.rangeDate.startDate = moment()
          .subtract(1, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = todayStart;

        break;
      case 'today':
        this.rangeDate.startDate = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = now.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'last7Days':
        this.rangeDate.startDate = moment()
          .subtract(7, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = todayStart;
        break;
      case 'last15Days':
        this.rangeDate.startDate = moment()
          .subtract(15, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = todayStart;
        break;
      case 'lastMonth':
        this.rangeDate.startDate = moment()
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');

        //La fecha final seria el primer dia del siguiente mes a las 00:00:00
        this.rangeDate.endDate = moment()
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'fromYesterday':
        this.rangeDate.startDate = moment()
          .subtract(1, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = now.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'fromWeekToNow':
        this.rangeDate.startDate = moment()
          .startOf('week')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = now.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'fromMonthToNow':
        this.rangeDate.startDate = moment()
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = now.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'fromYearToNow':
        this.rangeDate.startDate = moment()
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = now.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'lastWeek':
        this.rangeDate.startDate = moment()
          .subtract(1, 'week')
          .startOf('week')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = moment()
          .subtract(1, 'week')
          .endOf('week')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'lastTwoWeek':
        this.rangeDate.startDate = moment()
          .subtract(2, 'week')
          .startOf('week')
          .format('YYYY-MM-DD HH:mm:ss');
        this.rangeDate.endDate = moment()
          .subtract(1, 'week')
          .endOf('week')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'lastYear':
        this.rangeDate.startDate = moment()
          .subtract(1, 'year')
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss');

        //La fecha final seria el primer dia del siguiente año a las 00:00:00
        this.rangeDate.endDate = moment()
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'last30Days':
        this.rangeDate.startDate = moment()
          .subtract(30, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');

        this.rangeDate.endDate = todayStart;
        break;
      default:
        // this.initRangeDate();
        break;
    }

    const d1: NgbDateStruct = {
      year: moment(this.rangeDate.startDate).year(),
      month: moment(this.rangeDate.startDate).month() + 1,
      day: moment(this.rangeDate.startDate).date(),
    };

    const d2: NgbDateStruct = {
      year: moment(this.rangeDate.endDate).year(),
      month: moment(this.rangeDate.endDate).month() + 1,
      day: moment(this.rangeDate.endDate).date(),
    };
    
    this.fromDate = NgbDate.from(d1);
    this.toDate = NgbDate.from(d2);

    this.emitRangeDate();

    // console.log(this.rangeDate.startDate, this.rangeDate.endDate);
  }
}
