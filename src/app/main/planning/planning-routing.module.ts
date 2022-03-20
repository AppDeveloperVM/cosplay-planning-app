import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningPage } from './planning.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningPage
  },
  {
    path: 'new-planning',
    loadChildren: () => import('./new-planning/new-planning.module').then( m => m.NewPlanningPageModule)
  },
  {
    path: 'edit/:planningId',
    loadChildren: () => import('./edit-planning/edit-planning.module').
    then( m => m.EditPlanningPageModule)
  },
  {
    path: 'details/:planningId',
    loadChildren: () => import('./planning-detail/planning-detail.module').then( m => m.PlanningDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningPageRoutingModule {}
