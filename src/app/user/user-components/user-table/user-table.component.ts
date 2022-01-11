import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NotifyService } from '../../../Services/Notify/Notify.service';
import { UserService } from "../../../Services/User/User.service";
import { HubService } from '../../../Services/Hub.service';
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
@Injectable()
export class UserTableComponent implements OnInit {
  listUser:any;
  BaseImage:any=environment.BaseImage;
  page = 1;
  count = 0;
  tableSize = 7;
  maxResult=7;


  constructor(private userService:UserService,private notify:NotifyService,private hubService:HubService,
) { }

  openModal() {
    
  }
  ngOnInit() {
    this.getListUser(this.page,this.maxResult);
    this.hubService.hubConnection.on('listuser',()=>{
      this.getListUser(this.page,this.maxResult);
    })
    this.hubService.hubConnection.on('online',(u)=>{
      this.getListUser(this.page,this.maxResult);
    })
    this.hubService.hubConnection.on('offline',(u)=>{
      this.getListUser(this.page,this.maxResult);
    })

    
  }
  getListUser(page:any,MaxResultCount:any){
    this.userService.list(page,MaxResultCount).subscribe((data:any)=>{
      this.listUser=data.items.map((items:any)=>items);
      this.count=data.totalCount;
    },error=>{
      this.notify.showError(error.message,"Error Server");
    })
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getListUser(this.page,this.maxResult);
  }  

  onTableSizeChange(event:any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListUser(this.page,this.maxResult);
  } 
  removeUser(id:string){
    this.userService.delete(id);
  }
 
}
