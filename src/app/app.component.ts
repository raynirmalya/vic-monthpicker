import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'vic-monthpicker';
  dateModel = new FormControl(); // new Date();
  maxDate: string;
  ngOnInit() {
    this.dateModel.setValue('2020-04-12');
    this.maxDate = '2020-05-18';
  }
}
