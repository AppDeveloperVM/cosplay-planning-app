import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPlanningPage } from './edit-planning.page';

const routes: Routes = [
  {
    path: '',
    component: EditPlanningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPlanningPageRoutingModule {}
