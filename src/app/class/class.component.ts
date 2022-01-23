import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassService } from '../Services/Class/Class.service';
import { HubService } from '../Services/Hub.service';
import { NotifyService } from '../Services/Notify/Notify.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import * as lodash from 'lodash';
import { UserService } from '../Services/User/User.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  //Property

  listClass: any;
  BaseImage: any = environment.BaseImage;
  page = 1;
  count = 0;
  tableSize = 7;
  maxResult = 7;
  closeResult = '';

  newClass: any = FormGroup;
  updateClass: any = FormGroup;
  newStudentClass: any = FormGroup;
  file: string = '';
  fileN = new FormControl();





  constructor(private classService: ClassService, private notify: NotifyService, private hubService: HubService,
    private modalService: NgbModal, private formBuider: FormBuilder, private userService: UserService) { }

  formatNumber(date: any) {
    return moment(date).format('YYYY-M-D');
  }
  ngOnInit() {
    this.getList(this.page, this.maxResult);
  }
  // get file
  onFileChange($event: any, action: string) {
    const file = $event.target.files[0]; // <--- File Object for future use.
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (acceptedImageTypes.includes(file.type)) {
      if (action === 'add') {
        this.newClass.controls.Image.setValue(file ? file : ''); // <-- Set Value for Validation
      }
      else {
        this.updateClass.controls.Image.setValue(file ? file : ''); // <-- Set Value for Validation
      }
    }
    else {
      this.notify.showError("Plese add image");
      $event.target.value = '';
    }
  }

  //Open and delete
  open(content: any, id: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.classService.delete(id).subscribe(res => { this.notify.showSuccess("remove success") });
    }, (reason) => {
    });
  }
  //Open and edit
  openEdit(content: any, data: any) {
    this.updateClass = this.formBuider.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      Image: ['', Validators.nullValidator],
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      const formData = new FormData();
      const res = Object.assign({}, this.updateClass.value);
      // tslint:disable-next-line:forin
      for (const o in res) {
        formData.append(o, res[o]);
      }
      this.classService.update(formData, data.id).subscribe((rsp) => {
        if (rsp.isSuccessed) {
          this.notify.showSuccess("Update Success");
        }
        else {
          this.notify.showError(rsp.message)
        }
      }, (err: string) => this.notify.showError(err));
    }, (reason) => {
    });
  }


  openNew(content: any) {
    this.newClass = this.formBuider.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      Image: ['', Validators.nullValidator],
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      const formData = new FormData();
      const res = Object.assign({}, this.newClass.value);
      // tslint:disable-next-line:forin
      for (const o in res) {
        formData.append(o, res[o]);
      }
      this.classService.create(formData).subscribe((rsp) => {
        if (rsp.isSuccessed) {
          this.notify.showSuccess("Add Success");
        }
        else {
          this.notify.showError(rsp.message)
        }
      }, err => this.notify.showError(err));
    }, (reason) => {
    });
  }


  openAddStudents(content: any, data: any) {
    this.getListAddedAndListStudent(data);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(re => {
      const dataSend: Array<any> = [];
      this.listUserToAdd.forEach(ele => {
        const selected = { Id: ele.id, Selected: true };
        dataSend.push(selected)
      })
      this.listUserRemoved.forEach(ele => {
        const selected = { Id: ele.id, Selected: false };
        dataSend.push(selected)
      })
      this.classService.addStudentsByClassId(data, { users: dataSend }).subscribe((res: any) => {
        console.log(res);
      })
    });
  }

  getList(page: any, MaxResultCount: any) {
    this.classService.list(page, MaxResultCount).subscribe((data: any) => {
      this.listClass = data.items.map((items: any) => items);
      this.count = data.totalCount;
    }, error => {
      this.notify.showError(error.message, "Error Server");
    })
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getList(this.page, this.maxResult);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getList(this.page, this.maxResult);
  }



  //list student to add
  listUserToAdd: Array<any> = [];
  //list user exist
  listUserAdded: any;
  //list user to show
  listUserToShow: Array<any> = [];
  //list user to remove
  listUserRemoved: Array<any> = [];


  getListAddedAndListStudent(id: any) {
    this.listUserToShow = [];
    this.listUserToAdd = [];
    this.listUserAdded = [];
    this.listUserRemoved = [];


    this.classService.getById(id).subscribe(data => {
      if (data.resultObj.appUser.length !== 0) {
        this.listUserAdded = (data.resultObj.appUser);
      }
    });

    this.userService.list(this.skipCountUser, this.maxResultUser, 'student').subscribe(r => {
      this.listUserToShow = lodash.differenceWith(r.items, this.listUserAdded, lodash.isEqual);
    })
  }
  skipCountUser = 1;
  maxResultUser = 10;


  transferData(data: any) {
    this.listUserToShow = this.listUserToShow.filter(ele => ele !== data);
    this.listUserToAdd.push(data)
  }

  transform(value: any) {
    if (value) {
      return value.substr(0, 11) + "...";
    }
    return value;
  }
  onRemoveFromAdd(value: any) {
    this.listUserAdded = this.listUserAdded.filter(ele => ele !== value);
    this.listUserRemoved.push(value);
  }
  onRemove(value: any) {
    this.listUserToAdd = this.listUserToAdd.filter(ele => ele !== value);
    this.listUserToShow.push(value);
  }
  onRemoveFromRemoved(value: any) {
    this.listUserRemoved = this.listUserRemoved.filter(el => el !== value);
    this.listUserToShow.push(value);
  }
}
