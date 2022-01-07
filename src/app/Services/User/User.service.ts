import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.BaseUrl+ 'accounts/';
  constructor(private http:HttpClient) { }
  
  list(SkipCount:any,MaxResultCount:any,Filter?:string): Observable<any> {
    return this.http.get(this.baseUrl+"?SkipCount="+SkipCount+"&MaxResultCount="+MaxResultCount); ;
  }
  update(data:any):Observable<any>{
    return this.http.post(this.baseUrl,data);
  }
  delete(id:string):Observable<any>{
    return this.http.delete(this.baseUrl+id);
  }
  updateStatus(data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}status`,data);
  }
}
