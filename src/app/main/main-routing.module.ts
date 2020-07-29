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
                loadChildren: () => import('./cosplays/my-cosplays/cosplay-details/cosplay-details.module').
                  then( m => m.CosplayDetailsPageModule)
              },
              {
                path: 'edit/:cosplayId',
                loadChildren: () => import('./cosplays/my-cosplays/edit-cosplay/edit-cosplay.module').then( m => m.EditCosplayPageModule)
              }
            ]
          },
          {
            path: 'cosplay-groups',
            children: [
              {
                path: '',
                loadChildren: () => import('./cosplays/cosplay-groups/cosplay-groups.module').then( m => m.CosplayGroupsPageModule)
              },
              {
                path: 'cosplay-group-form-request',
                children:
                [
                  {
                    path: ':cosplaygroupId',
                    loadChildren: () => import('./cosplays/cosplay-groups/cosplay-group-form-request/cosplay-group-form-request.module').
                    then( m => m.CosplayGroupFormRequestPageModule)
                  }
                ]
              },
              {
                path: ':cosplaygroupId',
                loadChildren: () => import('./cosplays/cosplay-groups/cosplay-group-details/cosplay-group-details.module').
                then( m => m.CosplayGroupDetailsPageModule)
              },
              {
                path: 'edit/:cosplaygroupId',
                loadChildren: () => import('./cosplays/cosplay-groups/edit-cosplay-group/edit-cosplay-group.module').
                then( m => m.EditCosplayGroupPageModule)
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
          },
          {
            path: 'new-planning',
            loadChildren: () => import('./planning/new-planning/new-planning.module').then( m => m.NewPlanningPageModule)
          },
          {
            path: ':planningId',
            loadChildren: () => import('./planning/planning-detail/planning-detail.module').then( m => m.PlanningDetailPageModule)
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
