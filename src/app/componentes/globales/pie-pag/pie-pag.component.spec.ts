import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiePagComponent } from './pie-pag.component';

describe('PiePagComponent', () => {
  let component: PiePagComponent;
  let fixture: ComponentFixture<PiePagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiePagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiePagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
