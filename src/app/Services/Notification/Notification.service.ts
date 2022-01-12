import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 baseUrl = environment.BaseUrl+ 'Notifications/';
  constructor(private http:HttpClient) { }
  
  list(SkipCount:any,MaxResultCount:any,Filter?:string): Observable<any> {
    return this.http.get(this.baseUrl+"?SkipCount="+SkipCount+"&MaxResultCount="+MaxResultCount); 
  }
  delete(id:string):Observable<any>{
    return this.http.delete(this.baseUrl+id);
  }
  
  createNotify(data:any):Observable<any>{
    return this.http.post(this.baseUrl,data);
  } 

  sendNotify(data:any,inputSearch:any):Observable<any>{
    return this.http.post(this.baseUrl+data,inputSearch);
  }
}
