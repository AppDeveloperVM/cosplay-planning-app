import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConDetailPage } from './con-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ConDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConDetailPageRoutingModule {}
