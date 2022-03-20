import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplayGroupsPage } from './cosplay-groups.page';

const routes: Routes = [
  {
    path: '',
    component: CosplayGroupsPage
  },
  {
    path: 'new',
    loadChildren: () =>
      import('./new-cosplay-group/new-cosplay-group.module').then( m => m.NewCosplayGroupPageModule)
  },
  {
    path: 'edit/:cosplayGroupId',
    loadChildren: () =>
    import('./edit-cosplay-group/edit-cosplay-group.module').then( m => m.EditCosplayGroupPageModule)
  },
  {
    path: 'details/:cosplayGroupId',
    loadChildren: () =>
      import('./cosplay-group-details/cosplay-group-details.module').then( m => m.CosplayGroupDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplayGroupsPageRoutingModule {}
