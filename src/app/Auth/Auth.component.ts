import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/Auth/AuthService.service';
import { NotifyService } from '../Services/Notify/Notify.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-Auth',
  templateUrl: './Auth.component.html',
  styleUrls: ['./Auth.component.scss']
})
export class AuthComponent implements OnInit {
  login: any = FormGroup;
  constructor(private router: Router, private userService: AuthService,
     private formBuider: FormBuilder, private notify: NotifyService) { }

  ngOnInit() {
    this.login = this.formBuider.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  onSubmit(data: any) {
    this.userService.login(data).subscribe((auth:any) => {
      if (auth.isSuccessed) {
        sessionStorage.setItem('user',JSON.stringify(auth.resultObj));
        sessionStorage.setItem('token', auth.resultObj.accessToken);
        if (auth.resultObj.roles.length > 0) {
          this.notify.showSuccess('Đăng nhập thành công !!', 'Success');
          this.router.navigate(['']);
        }
      } else {
        this.notify.showError(auth.message, 'Fail');
      }
    },error=>{
      this.notify.showError(error.message, 'Error Server');
    });
  }

}
