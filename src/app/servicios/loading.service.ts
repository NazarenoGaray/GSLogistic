import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  getEstado() {
    return this.loadingSubject;
  }
  show(): void {
    this.loadingSubject.next(true);
  }
  hide(): void {
    this.loadingSubject.next(false);
  }
}
