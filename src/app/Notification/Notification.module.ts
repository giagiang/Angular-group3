import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './Notification.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


const notifyRoute: Routes = [
  {
    path: '',
    component: NotificationComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(notifyRoute),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    InfiniteScrollModule
  ],
  declarations: [NotificationComponent]
})
export class NotificationModule { }
