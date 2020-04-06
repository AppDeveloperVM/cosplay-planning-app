import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCosplayPage } from './new-cosplay.page';

const routes: Routes = [
  {
    path: '',
    component: NewCosplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCosplayPageRoutingModule {}
