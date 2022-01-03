import { Component, Input, OnInit } from '@angular/core';
import { Cosplay } from '../../cosplay.model';

@Component({
  selector: 'app-cosplay-item',
  templateUrl: './cosplay-item.component.html',
  styleUrls: ['./cosplay-item.component.scss'],
})
export class CosplayItemComponent implements OnInit {
  @Input() cosplay: Cosplay;

  constructor() { }

  ngOnInit() {
    console.log(this.cosplay);
  }

}
