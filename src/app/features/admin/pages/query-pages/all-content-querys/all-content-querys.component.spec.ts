import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllContentQuerysComponent } from './all-content-querys.component';

describe('AllContentQuerysComponent', () => {
  let component: AllContentQuerysComponent;
  let fixture: ComponentFixture<AllContentQuerysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllContentQuerysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllContentQuerysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
