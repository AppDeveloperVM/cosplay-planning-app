import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCosplaysPage } from './my-cosplays.page';

const routes: Routes = [
  {
    path: '',
    component: MyCosplaysPage
  },
  {
    path: 'new-cosplay',
    loadChildren: () => import('./new-cosplay/new-cosplay.module').then( m => m.NewCosplayPageModule)
  },
  {
    path: 'edit-cosplay',
    loadChildren: () => import('./edit-cosplay/edit-cosplay.module').then( m => m.EditCosplayPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCosplaysPageRoutingModule {}
