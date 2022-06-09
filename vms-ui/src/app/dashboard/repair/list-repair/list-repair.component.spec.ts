import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRepairComponent } from './list-repair.component';

describe('ListRepairComponent', () => {
  let component: ListRepairComponent;
  let fixture: ComponentFixture<ListRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
