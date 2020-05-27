import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupsPage } from './cosplay-groups.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupsPage
  },
  {
    path: 'cosplay-group-edit',
    loadChildren: () => import('./cosplay-group-details/cosplay-group-details.module').then( m => m.CosplayGroupDetailsPageModule)
  },
  {
    path: 'new-cosplay-group',
    loadChildren: () => import('./new-cosplay-group/new-cosplay-group.module').then( m => m.NewCosplayGroupPageModule)
  },
  {
    path: 'cosplay-group-details',
    children:
      [
        {
          path: ':cosplayGroupId',
          loadChildren: () => import('./cosplay-group-details/cosplay-group-details.module').then( m => m.CosplayGroupDetailsPageModule)
        }
      ]
  },
  {
    path: 'cosplay-group-form-request',
    children:
    [
      {
        path: ':cosplayGroupId',
        loadChildren: () => import('./cosplay-group-form-request/cosplay-group-form-request.module').then( m => m.CosplayGroupFormRequestPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupsPageRoutingModule {}
