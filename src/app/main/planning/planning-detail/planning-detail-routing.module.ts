import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningDetailPage } from './planning-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningDetailPage
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningDetailPageRoutingModule {}
