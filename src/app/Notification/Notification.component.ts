import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HubService } from '../Services/Hub.service';
import { NotificationService } from '../Services/Notification/Notification.service';
import { NotifyService } from '../Services/Notify/Notify.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserService } from '../Services/User/User.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-Notification',
  templateUrl: './Notification.component.html',
  styleUrls: ['./Notification.component.scss']
})
export class NotificationComponent implements OnInit {
  newNotify: any = FormGroup;
  searchUser: any = FormGroup;
  listNotify: any;
  page = 1;
  count = 0;
  tableSize = 7;
  maxResult = 7;
  public Editor = ClassicEditor;

  listUser: Set<any> = new Set();
  listUserFromApi: any;
  inputSearch: string = '';
  modelChanged = new Subject<string>();


  constructor(private hubService: HubService,
    private modalService: NgbModal, private notifyService: NotificationService, private notify: NotifyService,
    private formBuider: FormBuilder, private userService: UserService) {

  }
  changed(text: string) {
    this.statusInput = "Loading ...";
    this.modelChanged.next(text);
  }

  getListUserFromApi(filter?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.list(0, this.maxResult, filter).subscribe(data => {
        if (data.items.length > 0) {
          this.listUserFromApi = data.items;
          return resolve(data);
        }
        else {
          return reject(data);
        }
      });
    });
  }

  ngOnInit() {
    this.getListNotify(this.page, this.maxResult);
    this.hubService.hubConnection.on('notify', res => {
      this.getListNotify(this.page, this.maxResult);
    });

  }

  openNotify(content: any, id: string) {
    console.log(this.listNotify)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.notifyService.sendNotify(id,[]).subscribe(res => {
        this.notify.showSuccess("Send Notify to All", "Send success !!");
      });
    });
  }
  setListData(data:any){
    this.listUser.add(data);
  }
  statusInput: string = '';
  openNotifyToUsers(content: any, id: string) {
    this.modelChanged
      .pipe(
        debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.getListUserFromApi(this.inputSearch).then((r) => {
          this.statusInput = ''
        }).catch(e => this.statusInput = "Can't find anything");
      })
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      const payLoad=new Array<any>();
      this.listUser.forEach(data=>{
        payLoad.push(data);
      })
      this.notifyService.sendNotify(id,payLoad).subscribe(res => {
        this.notify.showSuccess("Send Notify to All", "Send success !!");
        this.listUser.clear();
        this.inputSearch='';
      });
    })
  }

  open(content: any) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.newNotify = this.formBuider.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      UserCreated: [user.userName]
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.notifyService.createNotify(this.newNotify.value).subscribe(res => {
        console.log(res);
      }, err => this.notify.showError(err));
    }, (reason) => {
    });
  }

  openDelete(content: any, Id: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.notifyService.delete(Id).subscribe(res => {
        this.notify.showSuccess("Remove", "Remove Success")
      }, err => this.notify.showError(err))
    }, (reason) => {
    });
  }


  getListNotify(page: number, maxresult: number) {
    this.notifyService.list(page, maxresult).subscribe((data: any) => {
      this.listNotify = data.items.map((items: any) => items);
      this.count = data.totalCount;
    }, error => {
      this.notify.showError(error.message, "Error Server");
    })
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getListNotify(this.page, this.maxResult);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListNotify(this.page, this.maxResult);
  }

}
