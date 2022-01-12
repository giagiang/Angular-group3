import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './Auth/Auth.component';
import { ExpenseGuard } from './expense.guard';

import { FullComponent } from './layouts/full/full.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('./Notification/Notification.module').then(m => m.NotificationModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
     
    ],
    canActivate:[ExpenseGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: () => import('./Auth/Auth.module').then(m => m.AuthModule)
  }
];
