import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from './planning.model';
import { Subscription } from 'rxjs';
import { PlanningService } from './planning.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PopoverController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit, OnDestroy {
  loadedPlannings: Planning[];
  isLoading = false;
  listedLoadedPlannings: Planning[];
  relevantPlannings: Planning[];
  private planningSub: Subscription;
  private filter = 'all';

  constructor(
    private planningService: PlanningService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private routermodule: RouterModule
  ) { }

  ngOnInit() {
    this.planningSub = this.planningService.plannings.subscribe(plannings => {
      this.loadedPlannings = plannings;
      this.listedLoadedPlannings = this.loadedPlannings;
      this.onFilterUpdate(this.filter);
    });
    // this.relevantCosplays = this.loadedCosplays;

  }

  onFilterUpdate(filter: string) {
    if (filter === 'all') {
      this.relevantPlannings = this.loadedPlannings; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantPlannings = this.loadedPlannings.filter(
        planning => planning//.status !== true // checking status
      );
    }
    this.listedLoadedPlannings = this.relevantPlannings;
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.planningService.fetchPlannings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if(this.planningSub) {
      this.planningSub.unsubscribe();
    }
  }

}
