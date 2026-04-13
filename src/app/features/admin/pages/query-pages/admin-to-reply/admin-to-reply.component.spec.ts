import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminToReplyComponent } from './admin-to-reply.component';

describe('AdminToReplyComponent', () => {
  let component: AdminToReplyComponent;
  let fixture: ComponentFixture<AdminToReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminToReplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminToReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
