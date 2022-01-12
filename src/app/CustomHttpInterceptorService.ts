import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../environments/environment';
import {Observable} from 'rxjs';
 
@Injectable()
export class CustomHttpInterceptorService implements HttpInterceptor {
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
 
    // if (!request.headers.has('Accept')) {
    //   request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    // }
 
    //request = request.clone({headers: request.headers.set('Accept-Language', 'fr-FR')});
    const isApiUrl = request.url.startsWith(environment.BaseUrl);
    const account = sessionStorage.getItem('token');
    if(isApiUrl && account){
        request = request.clone({headers: request.headers.set('Authorization','Bearer '+account)})
    }
    return next.handle(request);
  }
}
