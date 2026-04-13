import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactQueryComponent } from './view-contact-query.component';

describe('ViewContactQueryComponent', () => {
  let component: ViewContactQueryComponent;
  let fixture: ComponentFixture<ViewContactQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContactQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContactQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
