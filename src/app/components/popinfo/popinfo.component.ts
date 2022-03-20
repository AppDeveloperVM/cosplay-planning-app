import { Component, OnInit, Input,Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor( private popoverCtrl: PopoverController,private router: Router) { }

  ngOnInit() {};

  transform(value) {
    return value.slice().reverse();
  }


  onClick(category: string, id: string) {

    console.log('category: '+category+', item: ' + id);
    if(category == 'cosplay'){
      this.router.navigate(['main/tabs/cosplays/my-cosplays/details/'+ id]);
    }

    this.popoverCtrl.dismiss({
      id,
    });
  }

}
