import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupDetailsPage } from './cosplay-group-details.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupDetailsPageRoutingModule {}
