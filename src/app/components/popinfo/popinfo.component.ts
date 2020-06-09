import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
})
export class PopinfoComponent implements OnInit {
  @Input() notif_count: any[];

  items = this.notif_count;

  notifications = [
    {"id":1,"name":"JhonMarcus","type":"comment","text":"I really liked your photo, you are improving!"},
    {"id":2,"name":"Elizabeth duck looking","type":"comment","text":"Are you planning on buying another t-shirt?"},
    {"id":3,"name":"Fantastic Metal Computer","type":"like"},
    {"id":4,"name":"Refined Concrete Chair","type":"follow"}
  ];

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
