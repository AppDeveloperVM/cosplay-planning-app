import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
})
export class PopinfoComponent implements OnInit {
  @Input() notif_count: Number;

  items = Array(this.notif_count);

  constructor( private popoverCtrl: PopoverController) { }

  ngOnInit() {
    console.log(this.notif_count);
  }

  onClick( valor: number) {

    console.log('item' + valor);

    this.popoverCtrl.dismiss({
      item: valor,
    });
  }

}
