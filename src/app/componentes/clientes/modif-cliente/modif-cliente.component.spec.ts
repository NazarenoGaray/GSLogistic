import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifClienteComponent } from './modif-cliente.component';

describe('ModifClienteComponent', () => {
  let component: ModifClienteComponent;
  let fixture: ComponentFixture<ModifClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
