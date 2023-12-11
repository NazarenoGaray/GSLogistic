import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConsiltasComponent } from './listar-consiltas.component';

describe('ListarConsiltasComponent', () => {
  let component: ListarConsiltasComponent;
  let fixture: ComponentFixture<ListarConsiltasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarConsiltasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarConsiltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
