import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserTableComponent } from './user-components/user-table/user-table.component';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-components/user-profile/user-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';


const userRoute: Routes = [
  {
    path: '',
    component: UserComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoute),
    NgxPaginationModule,
    
  ],
  declarations: [UserComponent, UserTableComponent],
  providers:[]
})
export class UserModule { }
