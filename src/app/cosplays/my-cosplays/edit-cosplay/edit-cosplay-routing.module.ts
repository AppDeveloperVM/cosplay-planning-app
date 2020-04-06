import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCosplayPage } from './edit-cosplay.page';

const routes: Routes = [
  {
    path: '',
    component: EditCosplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCosplayPageRoutingModule {}
