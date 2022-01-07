import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.BaseUrl+ 'accounts/';
  status=new Subject<boolean>()
  constructor(private http: HttpClient) { }

 
  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'authenticate', data, {withCredentials: true});
  }
}
