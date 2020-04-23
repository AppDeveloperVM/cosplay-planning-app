import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
            children : [
              {
                path: '',
                loadChildren: () => import('./cosplays/my-cosplays/my-cosplays.module').then( m => m.MyCosplaysPageModule)
              },
              {
                path: 'new',
                loadChildren: () => import('./cosplays/my-cosplays/new-cosplay/new-cosplay.module').then( m => m.NewCosplayPageModule)
              },
              {
                path: ':cosplayId',
                // tslint:disable-next-line: max-line-length
                loadChildren: () => import('./cosplays/my-cosplays/cosplay-details/cosplay-details.module').then( m => m.CosplayDetailsPageModule)
              },
              {
                path: 'edit/:cosplayId',
                loadChildren: () => import('./cosplays/my-cosplays/edit-cosplay/edit-cosplay.module').then( m => m.EditCosplayPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'conventions',
        children:
        [
          {
            path: '',
            loadChildren: () => import('./conventions/conventions.module').then( m => m.ConventionsPageModule)
          },
          {
            path: ':conId',
            loadChildren: () => import('./conventions/con-detail/con-detail.module').then( m => m.ConDetailPageModule)
          }
        ]
      },
      {
        path: 'planning',
        children:
        [
          {
            path: '',
            loadChildren: () => import('./planning/planning.module').then( m => m.PlanningPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/main/tabs/cosplays/my-cosplays',
        pathMatch: 'full'
      }
    ]
  }
  ,
  {
    path: '',
    redirectTo: '/main/tabs/cosplays/my-cosplays',
    pathMatch: 'full'
  },
  {
    path: 'planning',
    loadChildren: () => import('./planning/planning.module').then( m => m.PlanningPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
