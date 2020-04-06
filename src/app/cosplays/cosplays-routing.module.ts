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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplaysPageRoutingModule {}
