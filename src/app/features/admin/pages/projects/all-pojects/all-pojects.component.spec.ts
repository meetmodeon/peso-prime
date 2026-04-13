import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPojectsComponent } from './all-pojects.component';

describe('AllPojectsComponent', () => {
  let component: AllPojectsComponent;
  let fixture: ComponentFixture<AllPojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPojectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
