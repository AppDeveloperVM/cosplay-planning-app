import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningPage } from './planning.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningPage
  },  {
    path: 'new-planning',
    loadChildren: () => import('./new-planning/new-planning.module').then( m => m.NewPlanningPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningPageRoutingModule {}
