import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  baseUrl = environment.BaseUrl + 'classes/';
  constructor(private http: HttpClient) { }

  list(SkipCount: any, MaxResultCount: any, Filter?: string): Observable<any> {
    let filter!: string;
    if (Filter !== undefined) { filter = "&Filter=" + Filter }
    else { filter = '' }
    return this.http.get(this.baseUrl + "?SkipCount=" + SkipCount + "&MaxResultCount=" + MaxResultCount + filter);;
  }
  update(data: any, id: string): Observable<any> {
    return this.http.put(this.baseUrl + id, data);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }
  updateStatus(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}status`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data)
  }
  getById(data: any): Observable<any> {
    return this.http.get(this.baseUrl + data);
  }

  addStudentsByClassId(id:string,data:any):Observable<any> {
    return this.http.put(this.baseUrl+"addStudent/" + id,data);
  }
}
