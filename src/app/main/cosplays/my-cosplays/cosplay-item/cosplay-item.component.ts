import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Cosplay } from '../../cosplay.model';

@Component({
  selector: 'app-cosplay-item',
  templateUrl: './cosplay-item.component.html',
  styleUrls: ['./cosplay-item.component.scss'],
})
export class CosplayItemComponent implements OnInit {
  @Input() cosplay: Cosplay;
  public imgSrc: any;

  navigationExtras: NavigationExtras = {
    state : {
      cosplay: null
    }
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.cosplay);
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/my-cosplays/cosplay-details'], this.navigationExtras );
  }

  onGoToEdit(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/my-cosplays/edit/'], this.navigationExtras );
  }

}
