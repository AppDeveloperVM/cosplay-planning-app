import { Component, OnInit, Input } from '@angular/core';
import { Planning } from '../planning.model';

@Component({
  selector: 'app-planning-item',
  templateUrl: './planning-item.component.html',
  styleUrls: ['./planning-item.component.scss'],
})
export class PlanningItemComponent implements OnInit {
  @Input() planning: Planning;

  constructor() { }

  ngOnInit() {
    console.log(this.planning);
  }

  getDummyDate() {
    return new Date();
  }

}
