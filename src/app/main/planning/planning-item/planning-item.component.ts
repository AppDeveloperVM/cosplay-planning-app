import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Planning } from '../planning.model';

@Component({
  selector: 'app-planning-item',
  templateUrl: './planning-item.component.html',
  styleUrls: ['./planning-item.component.scss'],
})
export class PlanningItemComponent implements OnInit {
  @Input() planning: Planning;
  public imgSrc: any;

  navigationExtras: NavigationExtras = {
    state : {
      planning: null
    }
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.planning);
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
