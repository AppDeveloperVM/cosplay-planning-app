import { Component, OnInit, Input } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';

@Component({
  selector: 'app-cosplay-group-item',
  templateUrl: './cosplay-group-item.component.html',
  styleUrls: ['./cosplay-group-item.component.scss'],
})
export class CosplayGroupItemComponent implements OnInit {
  @Input() cosplaygroup: CosplayGroup;
  constructor() { }

  ngOnInit() {}

  getDummyDate() {
    return new Date();
  }

}
