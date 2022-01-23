import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NotifyService } from '../../../Services/Notify/Notify.service';
import { UserService } from "../../../Services/User/User.service";
import { HubService } from '../../../Services/Hub.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as lodash from 'lodash';
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
  updateUser: any = FormGroup;
  file: string = '';
  fileN = new FormControl();
  listRoles!: any;
  constructor(private userService: UserService, private notify: NotifyService, private hubService: HubService,
    private modalService: NgbModal, private formBuider: FormBuilder
  ) { }

  open(content: any, id: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(id);
      this.userService.delete(id).subscribe(res => { console.log(res) });
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEdit(content: any, data: any) {
    this.getListRoles();
    this.updateUser = this.formBuider.group({
      FullName: [data.fullName, Validators.required],
      Email: [data.email, [Validators.required, Validators.email]],
      Image: [data.image, Validators.nullValidator],
    });
    this.checkedEdit = data.appRole;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      const checkBox = this.updateUser.get('Roles') as FormArray;
      for (const item of this.returnValue) {
        checkBox.push(this.formBuider.group(item));
      }


      const formData = new FormData();
      const res = Object.assign({}, this.updateUser.value);
      // tslint:disable-next-line:forin
      for (const o in res) {
        formData.append(o, res[o]);
      }

      this.userService.update(formData, data.id).subscribe((rsp) => {
        if (rsp.isSuccessed) {
          this.notify.showSuccess("Add Success");
        }
        else {
          this.notify.showError(rsp.message)
        }
      }, err => this.notify.showError(err));
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
  onFileChange($event: any, action: string) {
    const file = $event.target.files[0]; // <--- File Object for future use.
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (acceptedImageTypes.includes(file.type)) {
      if (action === 'add') {
        this.newUser.controls.Image.setValue(file ? file : ''); // <-- Set Value for Validation
      }
      else {
        this.updateUser.controls.Image.setValue(file ? file : '');
      }
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
      Password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      Email: ['', [Validators.required, Validators.email]],
      Image: ['', Validators.nullValidator],
      Roles: []
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      const formData = new FormData();
      const res = Object.assign({}, this.newUser.value);
      // tslint:disable-next-line:forin
      for (const o in res) {
        formData.append(o, res[o]);
      }
      this.userService.createUser(formData).subscribe((rsp) => {
        if (rsp.isSuccessed) {
          this.notify.showSuccess("Add Success");
        }
        else {
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

  //Check exits
  checkExits(array1: any) {
    array1.users = null;
    const result = lodash.findIndex(this.checkedEdit, array1);
    return result;
  }



  // Role assign
  checkedEdit: any = '';

  openRoleAssign(content: any, data: any) {
    this.getListRoles();
    this.checkedEdit = data.appRole;
    console.log(data)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      const valueToSend: any = { roles: [] };
      for (const dt of this.returnValue) {
        valueToSend.roles.push(dt)
      }
      console.log(valueToSend);
      this.userService.roleAssign(valueToSend, data.id).subscribe((rsp) => {
        if (rsp.isSuccessed) {
          this.notify.showSuccess("Add Success");
        }
        else {
          this.notify.showError(rsp.message)
        }
      }, err => this.notify.showError(err));
    });
  }

  returnValue: Array<any> = []


  onToggle(event: any) {
    if (this.returnValue.length === 0) {
      this.returnValue.push({ name: event.target.value, selected: event.target.checked});
    }
    else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.returnValue.length; i++) {
        if (this.returnValue[i].name === event.target.value) {
          this.returnValue[i].selected = event.target.checked;
          break;
        }
        else if (i === this.returnValue.length - 1) {
          this.returnValue.push({ name: event.target.value, selected: event.target.checked });
        }
      }
    }
  }

}
