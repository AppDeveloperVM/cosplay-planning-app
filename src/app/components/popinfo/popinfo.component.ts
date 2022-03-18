import { Component, OnInit, Input,Pipe, PipeTransform } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
})
@Pipe({ name: 'reverse' })

export class PopinfoComponent implements OnInit,PipeTransform {
  // items = this.notif_count;

  @Input() notifications;

  constructor( private popoverCtrl: PopoverController) { }

  ngOnInit() {};

  transform(value) {
    return value.slice().reverse();
  }


  onClick(category: string, item: number) {

    console.log('category: '+category+', item: ' + item);

    this.popoverCtrl.dismiss({
      item,
    });
  }

}
