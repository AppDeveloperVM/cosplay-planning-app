import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConventionsPage } from './conventions.page';

const routes: Routes = [
  {
    path: '',
    component: ConventionsPage
  },
  {
    path: 'con-detail',
    loadChildren: () => import('./con-detail/con-detail.module').then( m => m.ConDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConventionsPageRoutingModule {}
