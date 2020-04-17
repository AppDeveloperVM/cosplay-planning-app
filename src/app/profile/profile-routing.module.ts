import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: ProfilePage,
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
          },
          {
            path: ':cosplayId',
            // tslint:disable-next-line: max-line-length
            loadChildren: () => import('./cosplays/my-cosplays/cosplay-details/cosplay-details.module').then( m => m.CosplayDetailsPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('./cosplays/my-cosplays/new-cosplay/new-cosplay.module').then( m => m.NewCosplayPageModule)
          },
          {
            path: 'edit/:cosplayId',
            loadChildren: () => import('./cosplays/my-cosplays/edit-cosplay/edit-cosplay.module').then( m => m.EditCosplayPageModule)
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
        path: '',
        redirectTo: '/profile/tabs/cosplays/my-cosplays',
        pathMatch: 'full'
      }
    ]
  }
  ,
  {
    path: '',
    redirectTo: '/profile/tabs/cosplays/my-cosplays',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
