import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class ExpenseGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean | UrlTree {
      const url: string = state.url;

      return this.checkLogin(url);
   }

   checkLogin(url: string): any {
      console.log("Url: " + url)
      const val = sessionStorage.getItem('user');
      if (val !== null) {
         if (url === '/login') {
            this.router.parseUrl('/expenses');
         }
         else {
            return true;
         }
      } else {
         return this.router.parseUrl('login');
      }
   }

}
