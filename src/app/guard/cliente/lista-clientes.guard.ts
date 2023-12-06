import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaClientesGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ){}
  canActivate(): Observable<boolean> {
    const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
    if (accessToken) {
      return this.auth.user.pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/sesion']);
            return of(false);
          } else {
            return this.verificarRolUsuario(user.uid);
          }
        })
      );
    } else {
      this.router.navigate(['/sesion']);
      return of(false);
    }
  }
  
  verificarRolUsuario(userId: string): Observable<boolean> {
    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .valueChanges()
      .pipe(
        take(1),
        map((userData: any) => {
          if (userData && userData.rol === 'Administrador' || userData.rol === 'Encargado' || userData.rol === 'Oficial de Cuenta' ) {
            return true;
          } else {
            this.router.navigate(['/403']);
            return false;
          }
        })
      );
  }
}
