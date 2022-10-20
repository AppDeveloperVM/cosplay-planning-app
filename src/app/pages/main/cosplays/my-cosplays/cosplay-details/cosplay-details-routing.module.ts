import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayDetailsPage } from './cosplay-details.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayDetailsPage
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayDetailsPageRoutingModule {}
