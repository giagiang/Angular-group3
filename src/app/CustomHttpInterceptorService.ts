import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './Services/Spin/Loading.service';

@Injectable()
export class CustomHttpInterceptorService implements HttpInterceptor {

  private totalRequests = 0;
  constructor(private loadingService: LoadingService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});

    // if (!request.headers.has('Accept')) {
    //   request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    // }

    //request = request.clone({headers: request.headers.set('Accept-Language', 'fr-FR')});
    const isApiUrl = request.url.startsWith(environment.BaseUrl);
    const account = sessionStorage.getItem('token');
    if (isApiUrl && account) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + account) })
    }
    this.totalRequests++;
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
