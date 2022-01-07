import { Component, Input, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-Modal',
  templateUrl: './Modal.component.html',
  styleUrls: ['./Modal.component.scss']
})
export class ModalComponent implements OnInit {

  title!: string;
  content!: string;
  constructor(public modalRef: MdbModalRef<ModalComponent>) { }

  ngOnInit() {
  }

 
}
