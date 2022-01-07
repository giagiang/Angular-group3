import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user:any=sessionStorage.getItem('user');
  email:any;
  image:any;
  fullName:any;
  constructor() { }

  ngOnInit() {
    const u=JSON.parse(this.user);
    this.email=u.email;
    this.image=environment.BaseImage+u.image;
    this.fullName=u.fullName;
  }

}
