import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoIngresoComponent } from './nuevo-ingreso.component';

describe('NuevoIngresoComponent', () => {
  let component: NuevoIngresoComponent;
  let fixture: ComponentFixture<NuevoIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
