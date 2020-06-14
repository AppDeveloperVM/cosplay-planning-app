import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCosplayGroupPage } from './edit-cosplay-group.page';

const routes: Routes = [
  {
    path: '',
    component: EditCosplayGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCosplayGroupPageRoutingModule {}
