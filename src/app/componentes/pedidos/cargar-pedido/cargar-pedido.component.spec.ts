import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarPedidoComponent } from './cargar-pedido.component';

describe('CargarPedidoComponent', () => {
  let component: CargarPedidoComponent;
  let fixture: ComponentFixture<CargarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarPedidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
