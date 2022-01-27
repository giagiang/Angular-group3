import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { keyframes } from '@angular/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  imports: [
    
  ],
  exports: [
    NgbModule,
    CommonModule, 
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    InfiniteScrollModule    
  ],
  declarations: []
})
export class SharedModule { }
