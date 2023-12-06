import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(
  ){}

  
  isLoggedIn(): boolean {
    const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
    return !!accessToken;
  }
}
