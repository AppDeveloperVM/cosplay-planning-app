import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCosplaysPage } from './my-cosplays.page';

const routes: Routes = [
  {
    path: '',
    component: MyCosplaysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCosplaysPageRoutingModule {}
