import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserTableComponent } from './user-components/user-table/user-table.component';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-components/user-profile/user-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserInboxComponent } from './user-components/user-inbox/user-inbox.component';


const userRoute: Routes = [
  {
    path: '',
    component: UserComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'inbox',
    component: UserInboxComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoute),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
    
  ],
  declarations: [UserComponent, UserTableComponent],
  providers:[]
})
export class UserModule { }
