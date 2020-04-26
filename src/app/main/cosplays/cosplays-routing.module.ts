import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplaysPage } from './cosplays.page';

const routes: Routes = [
  {
    path: '',
    component: CosplaysPage
  },
  {
    path: 'my-cosplays',
    loadChildren: () => import('./my-cosplays/my-cosplays.module').then( m => m.MyCosplaysPageModule)
  },
  {
    path: 'cosplay-groups',
    loadChildren: () => import('./cosplay-groups/cosplay-groups.module').then( m => m.CosplayGroupsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplaysPageRoutingModule {}
