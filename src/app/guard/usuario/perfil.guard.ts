import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const userIdInRoute = route.paramMap.get('id');
    const userDataString = sessionStorage.getItem('USER_DATA');
    
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userIdInUserData = userData.id;

      if (userIdInRoute === userIdInUserData) {
        return true;
      }
    }
    return this.router.parseUrl('/403');
  } 
  
}
