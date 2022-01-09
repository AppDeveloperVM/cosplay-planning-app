import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';

@Component({
  selector: 'app-cosplay-group-item',
  templateUrl: './cosplay-group-item.component.html',
  styleUrls: ['./cosplay-group-item.component.scss'],
})
export class CosplayGroupItemComponent implements OnInit, AfterViewInit {
  @Input() cosplaygroup: CosplayGroup;

  constructor() {
  }

  ngOnInit() {
    console.log(this.cosplaygroup);
  }

  ngAfterViewInit() {
  }

}
