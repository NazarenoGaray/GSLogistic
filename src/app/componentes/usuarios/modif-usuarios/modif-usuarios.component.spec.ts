import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifUsuariosComponent } from './modif-usuarios.component';

describe('ModifUsuariosComponent', () => {
  let component: ModifUsuariosComponent;
  let fixture: ComponentFixture<ModifUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
