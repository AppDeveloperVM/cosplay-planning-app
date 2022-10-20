import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPlanningPage } from './new-planning.page';

const routes: Routes = [
  {
    path: '',
    component: NewPlanningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPlanningPageRoutingModule {}
