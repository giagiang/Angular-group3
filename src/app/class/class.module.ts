import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassComponent } from './class.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'app/shared/shared.module';

const userRoute: Routes = [
  {
    path: '',
    component: ClassComponent,
  }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(userRoute),

  ],
  declarations: [ClassComponent]
})
export class ClassModule { }
