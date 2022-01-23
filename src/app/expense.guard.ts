import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ExpenseGuard implements CanActivate, CanLoad {

   constructor(private router: Router) { }
   canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if (route.path === 'nooso') {
         this.router.navigate(['NotFound']);
         return false;
      }
      return true;
   }

   canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean | UrlTree {
      if (sessionStorage.getItem('user')) {
         return true;
      }
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
   }
}
