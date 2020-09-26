import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosplaysPage } from './cosplays.page';

const routes: Routes = [
  {
    path: '',
    component: CosplaysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosplaysPageRoutingModule {}
