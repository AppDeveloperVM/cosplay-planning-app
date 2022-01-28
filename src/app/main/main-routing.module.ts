import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MainPage,
    children : [
      {
        path: 'cosplays',
        children: [
          {
            path: '',
            loadChildren: () => import('./cosplays/cosplays.module').then( m => m.CosplaysPageModule)
          },
          {
            path: 'my-cosplays',
              loadChildren: () => import('./cosplays/my-cosplays/my-cosplays.module').then( m => m.MyCosplaysPageModule)
          }
          
        ]
      },
      {
        path: 'cosplay-groups',
        loadChildren: () => import('./cosplay-groups/cosplay-groups.module').then( m => m.CosplayGroupsPageModule)
      },
      {
        path: 'planning',
        loadChildren: () => import('./planning/planning.module').then( m => m.PlanningPageModule)
      },
      {
        path: '',
        redirectTo: '/main/tabs/cosplays/my-cosplays',
        pathMatch: 'full',
        canLoad: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/tabs/cosplays/my-cosplays',
    pathMatch: 'full',
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
