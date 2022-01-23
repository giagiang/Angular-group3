import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseGuard } from './expense.guard';

import { FullComponent } from './layouts/full/full.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'notification',
        loadChildren: () => import('./Notification/Notification.module').then(m => m.NotificationModule)
      },
      {
        path: 'class',
        loadChildren: () => import('./class/class.module').then(m => m.ClassModule)
      }
    ],
    canActivate: [ExpenseGuard],
  },
  {
    path: 'NotFound',
    component: NotFoundComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./Auth/Auth.module').then(m => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'NotFound',
  },
];
