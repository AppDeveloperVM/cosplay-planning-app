import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'cosplays',
    loadChildren: () => import('./main/cosplays/cosplays.module').then( m => m.CosplaysPageModule)
  },
  {
    path: 'cosplay-groups',
    loadChildren: () => import('./main/cosplays/cosplays.module').then( m => m.CosplaysPageModule)
  },
  {
    path: 'conventions',
    loadChildren: () => import('./main/conventions/conventions.module').then( m => m.ConventionsPageModule)
  },
  {
    path: 'planning',
    loadChildren: () => import('./main/planning/planning.module').then( m => m.PlanningPageModule)
  },
  {
    path: 'profile',
    children : [
      {
        path: '',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./profile/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
      }
    ],
    canLoad: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
