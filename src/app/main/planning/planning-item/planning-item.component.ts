import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { Planning } from '../planning.model';

@Component({
  selector: 'app-planning-item',
  templateUrl: './planning-item.component.html',
  styleUrls: ['./planning-item.component.scss'],
})
export class PlanningItemComponent implements OnInit {
  @Input() planning: Planning;
  public imgSrc: any;
  isMobile: boolean;

  navigationExtras: NavigationExtras = {
    state : {
      planning: null
    }
  }

  constructor(
    private router: Router, 
    private platform: Platform
  ) { }

  ngOnInit() {
    //console.log(this.planning);
    this.checkPlatform();
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/planning/planning-detail'], this.navigationExtras );
  }

  onGoToEdit(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/planning/edit-planning'], this.navigationExtras );
  }

}
