import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupRequestPage } from './cosplay-group-request.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupRequestPageRoutingModule {}
