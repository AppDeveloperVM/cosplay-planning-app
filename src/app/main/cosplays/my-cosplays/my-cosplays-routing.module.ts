import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCosplaysPage } from './my-cosplays.page';

const routes: Routes = [
  {
    path: '',
    component: MyCosplaysPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-cosplay/new-cosplay.module')
    .then( m => m.NewCosplayPageModule)
  },
  {
    path: 'edit/:cosplayId',
    loadChildren: () => import('./edit-cosplay/edit-cosplay.module')
    .then( m => m.EditCosplayPageModule)
  },
  {
    path: 'details/:cosplayId',
    loadChildren: () => import('./cosplay-details/cosplay-details.module')
    .then( m => m.CosplayDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCosplaysPageRoutingModule {}
