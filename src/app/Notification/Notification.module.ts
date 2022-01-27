import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './Notification.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from 'app/shared/shared.module'; // absolute import 
// import { SharedModule } from '../shared/shared.module'; // relative import 


const notifyRoute: Routes = [
  {
    path: '',
    component: NotificationComponent,
  }
];
@NgModule({
  imports: [    
    RouterModule.forChild(notifyRoute),
    SharedModule
  ],
  declarations: [NotificationComponent]
})
export class NotificationModule { }
