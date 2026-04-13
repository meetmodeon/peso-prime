import { Component } from '@angular/core';
import { TeamMemberFormComponent } from '../team-member-form/team-member-form.component';
import { CommonModule } from '@angular/common';
import {
  TeamMemberRequest,
  TeamMemberResponse,
} from '../../../../../services/model/team-member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamMemberService } from '../../../../../services/teamMember/team-member.service';
import { TeamMemberStateService } from '../../../../../statemanagement/team/team-member-state.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { ImageResponse } from '../../../../../services/model/ImageResponse';
import { FileType } from '../../../../../services/model/FileType.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-team-member',
  imports: [TeamMemberFormComponent, CommonModule],
  templateUrl: './edit-team-member.component.html',
  styleUrl: './edit-team-member.component.scss',
})
export class EditTeamMemberComponent {
  existingMember: TeamMemberResponse | null = null;
  submitting = false;
  error: string | null = null;
  loading = false;
  loadError: string | null = null;

  private memberId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService,
    private state: TeamMemberStateService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.memberId = +this.route.snapshot.paramMap.get('id')!;
    this.loadMember();
  }

  private loadMember(): void {
    const formState = this.state
      .teamMembers()
      .find((m) => m.id === this.memberId);
    if (formState) {
      this.existingMember = formState;
      return;
    }

    // Fallback: fetch from API
    this.loading = true;

    this.teamMemberService.getById(this.memberId).subscribe({
      next: (member) => {
        this.existingMember = member;
        console.log('This is called by editTeamMember : ', this.existingMember);
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Failed to load member.Please go back and try again.';
        this.loading = false;
      },
    });
  }

  onFormSubmit(value: TeamMemberRequest): void {
    this.submitting = true;
    this.error = null;

    this.update(value, value.imageId);
  }

  private update(value: TeamMemberRequest, imageId?: number): void {
    const request: TeamMemberRequest = {
      name: value.name,
      qualifications: value.qualifications,
      phone: value.phone,
      association: value.association,
      yearOfExperience: value.yearOfExperience,
      design: value.design,
      bio: value.bio,
      imageId: imageId ,
    };

    this.teamMemberService.update(this.memberId, request).subscribe({
      next: (updated) => {
        this.state.updateTeamMember(updated);
        this.router.navigate(['/admin/teams']);
      },
      error: () => {
        this.error = 'Failed to update member. Please try again.';
        this.submitting = false;
      },
    });
  }
}
