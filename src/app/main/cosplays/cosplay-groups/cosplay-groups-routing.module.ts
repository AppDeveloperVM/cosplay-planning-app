import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupsPage } from './cosplay-groups.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupsPage
  },
  {
    path: 'cosplay-group-details',
    loadChildren: () => import('./cosplay-group-details/cosplay-group-details.module').then( m => m.CosplayGroupDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupsPageRoutingModule {}
