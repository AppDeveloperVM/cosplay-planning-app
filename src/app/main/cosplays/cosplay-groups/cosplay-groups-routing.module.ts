import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupsPage } from './cosplay-groups.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupsPageRoutingModule {}
