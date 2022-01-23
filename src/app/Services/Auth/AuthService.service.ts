import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HubService } from '../Hub.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.BaseUrl + 'accounts/';
  status = new Subject<boolean>()
  constructor(private http: HttpClient, private hubService: HubService) { }


  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'authenticate', data, { withCredentials: true });
  }

  logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.hubService.status = false;
    this.hubService.stopHubConnection();
  }
}
