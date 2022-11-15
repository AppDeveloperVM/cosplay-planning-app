import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent implements OnInit {
  @ViewChild(IonDatetime) datetime : IonDatetime;
  @Input() id = '1';
  @Input() dateValue = new Date();
  @Input() formattedString = "";
  @Input() tempRef = "datetime";
  @Output() dateTimePick = new EventEmitter<Date>();
  showDatePicker = false;

  constructor() { }

  ngOnInit() {
    console.log('dateValue init: ' + this.dateValue);
    this.setFormattedDate();
  }

  //Dates Functions ----
  setToday(){
    this.formattedString = format(parseISO(format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'), 'MMM d yyyy, HH:mm');
    console.log(this.formattedString);
  }

  setFormattedDate(){
    console.log('about to format date : '+ this.dateValue);
    
    this.formattedString = format(parseISO( this.dateValue.toString() ), 'MMM d yyyy, HH:mm');
  }

  dateChanged(value){
    console.log(value);
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'MMM d yyyy, HH:mm');
    this.showDatePicker = false;
    this.dateTimePick.emit(this.dateValue);
  }

  close(){
    this.datetime.cancel(true);
  }

  select(){
    this.datetime.confirm(true);
  }

}
