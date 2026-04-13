import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberFormComponent } from './team-member-form.component';

describe('TeamMemberFormComponent', () => {
  let component: TeamMemberFormComponent;
  let fixture: ComponentFixture<TeamMemberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
