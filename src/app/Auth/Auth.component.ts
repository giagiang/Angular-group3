import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  loading: boolean = false;
  returnUrl: string = '';
  constructor(private router: Router,private route:ActivatedRoute, private authService: AuthService,
    private formBuider: FormBuilder, private notify: NotifyService) { }

  ngOnInit() {
    //Reset login status
    this.authService.logout();
    //get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    // initial form
    this.login = this.formBuider.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  onSubmit(data: any) {
    this.loading = true;
    this.authService.login(data).subscribe((auth: any) => {
      if (auth.isSuccessed) {
        sessionStorage.setItem('user', JSON.stringify(auth.resultObj));
        sessionStorage.setItem('token', auth.resultObj.accessToken);
        if (auth.resultObj.roles.length > 0) {
          this.notify.showSuccess('Đăng nhập thành công !!', 'Success');
          this.router.navigateByUrl(this.returnUrl);
        }
      } else {
        this.notify.showError(auth.message, 'Fail');
      }
      this.loading = false;
    }, error => {
      this.notify.showError(error.message, 'Error Server');
      this.loading = false;
    });
  }

}
