import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-yo',
  templateUrl: './yo.component.html',
  styleUrls: ['./yo.component.css']
})
export class YoComponent {
  userInfo: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const apiUrl = 'https://api.github.com/users/NazarenoGaray'; // Reemplaza con tu propia URL de la API de GitHub

    this.http.get<any>(apiUrl).subscribe(
      userInfo => {
        this.userInfo = userInfo;
      },
      error => {
        console.error('Error al obtener la información del usuario de GitHub:', error);
      }
    );
  }
}
