import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupFormRequestPage } from './cosplay-group-form-request.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupFormRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupFormRequestPageRoutingModule {}
