import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NotifyService } from '../../../Services/Notify/Notify.service';
import { UserService } from "../../../Services/User/User.service";
import { HubService } from '../../../Services/Hub.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
@Injectable()
export class UserTableComponent implements OnInit {
  listUser: any;
  BaseImage: any = environment.BaseImage;
  page = 1;
  count = 0;
  tableSize = 7;
  maxResult = 7;
  closeResult = '';

  newUser: any = FormGroup;
  file: string = '';
  fileN = new FormControl();
  listRoles!: any;
  constructor(private userService: UserService, private notify: NotifyService, private hubService: HubService,
    private modalService: NgbModal, private formBuider: FormBuilder
  ) { }

  open(content: any, id: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(id);
      this.userService.delete(id).subscribe(res=>{console.log(res)});
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openEdit(content: any, data: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(data)
      this.userService.update(data);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getListRoles() {
    this.userService.getListRoles().subscribe(data => {
      this.listRoles = data;
    })
  }
  onFileChange($event: any) {
    const file = $event.target.files[0]; // <--- File Object for future use.
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (acceptedImageTypes.includes(file.type)) {
      this.newUser.controls.Image.setValue(file ? file : ''); // <-- Set Value for Validation
    }
    else {
      this.notify.showError("Plese add image");
      $event.target.value = '';
    }
  }
  openNew(content: any) {
    this.getListRoles();
    this.newUser = this.formBuider.group({
      FullName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      Email: ['', [Validators.required,Validators.email]],
      Image: ['', Validators.nullValidator],
      Roles: ['', Validators.required],
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      const formData = new FormData();
      const res = Object.assign({}, this.newUser.value);
      // tslint:disable-next-line:forin
      for (const o in res) {
        formData.append(o, res[o]);
      }
      this.userService.createUser(formData).subscribe((rsp) => {
        if(rsp.IsSuccessed){
          this.notify.showSuccess("Add Success");
        }
        else{
          this.notify.showError(rsp.message)
        }
      }, err => this.notify.showError(err));
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.getListUser(this.page, this.maxResult);
    this.hubService.hubConnection.on('listuser', () => {
      this.getListUser(this.page, this.maxResult);
    })
    this.hubService.hubConnection.on('online', (u) => {
      this.getListUser(this.page, this.maxResult);
    })
    this.hubService.hubConnection.on('offline', (u) => {
      this.getListUser(this.page, this.maxResult);
    })


  }
  getListUser(page: any, MaxResultCount: any) {
    this.userService.list(page, MaxResultCount).subscribe((data: any) => {
      this.listUser = data.items.map((items: any) => items);
      this.count = data.totalCount;
    }, error => {
      this.notify.showError(error.message, "Error Server");
    })
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getListUser(this.page, this.maxResult);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListUser(this.page, this.maxResult);
  }
  removeUser(id: any) {
    this.userService.delete(id);
  }

}
