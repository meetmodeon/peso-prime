import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TeamMemberFormComponent } from '../team-member-form/team-member-form.component';
import { TeamMemberService } from '../../../../../services/teamMember/team-member.service';
import { TeamMemberStateService } from '../../../../../statemanagement/team/team-member-state.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TeamMemberRequest } from '../../../../../services/model/team-member.model';
import { ImageService } from '../../../../../services/image/image.service';
import { ImageResponse } from '../../../../../services/model/ImageResponse';
import { FileType } from '../../../../../services/model/FileType.model';

@Component({
  selector: 'app-add-team-member',
  imports: [CommonModule, TeamMemberFormComponent],
  templateUrl: './add-team-member.component.html',
  styleUrl: './add-team-member.component.scss',
})
export class AddTeamMemberComponent {
  submitting = false;
  error: string | null = null;

  constructor(
    private teamMemberService: TeamMemberService,
    private state: TeamMemberStateService,
    private router: Router,
    private http: HttpClient,
    private imageService: ImageService,
  ) {}

  onFormSubmit(value: TeamMemberRequest): void {
    this.submitting = true;
    this.error = null;
    this.save(value);
  }

  private save(value: TeamMemberRequest): void {
    const request: TeamMemberRequest = {
      name: value.name,
      qualifications: value.qualifications,
      phone: value.phone,
      association: value.association,
      yearOfExperience: value.yearOfExperience,
      design: value.design,
      bio: value.bio,
      imageId: value.imageId,
    };

    this.teamMemberService.add(request).subscribe({
      next: (created) => {
        this.state.addTeamMember(created);
        this.router.navigate(['/admin/teams']);
      },
      error: () => {
        this.error = 'Failed to save member. Please try again.';
        this.submitting = false;
      },
    });
  }
}
