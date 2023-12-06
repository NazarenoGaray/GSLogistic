import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of} from 'rxjs';
import { map, switchMap,take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EstadoUsuarioGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  canActivate(): Observable<boolean> {
    const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
    if(accessToken){
      return this.auth.user.pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/sesion']);
            return of(false);
          } else {
            //console.log("viendo si no estas dehabilitado");
            return this.verificarEstadoUsuario(user.uid);
          }
        })
      );
    }else{
      this.router.navigate(['/sesion']);
      return of(false);
    }
  }

  verificarEstadoUsuario(userId: string): Observable<boolean> {
    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .valueChanges()
      .pipe(
        take(1),
        map((userData: any) => {
          //console.log("usaerData: ",userData);
          if (userData && userData.estado === 'Deshabilitado') {
            this.router.navigate(['/401']);
            console.log("estas dehabilitado");
            return false;
          } else if (userData && userData.rol === 'Nuevo') {
            this.router.navigate(['/403']);
            console.log("estas dehabilitado");
            return false;
          } else {
            console.log("estas habilitado");
            return true;
          }
        })
      );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
