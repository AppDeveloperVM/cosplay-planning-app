import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCosplayGroupPage } from './new-cosplay-group.page';

const routes: Routes = [
  {
    path: '',
    component: NewCosplayGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCosplayGroupPageRoutingModule {}
