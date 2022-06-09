import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMaintenancesComponent } from './list-maintenances.component';

describe('ListMaintenancesComponent', () => {
  let component: ListMaintenancesComponent;
  let fixture: ComponentFixture<ListMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMaintenancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
