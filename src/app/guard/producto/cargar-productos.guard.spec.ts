import { TestBed } from '@angular/core/testing';

import { CargarProductosGuard } from './cargar-productos.guard';

describe('CargarProductosGuard', () => {
  let guard: CargarProductosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CargarProductosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
