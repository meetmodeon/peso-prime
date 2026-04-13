import { Component } from '@angular/core';
import { TeamMemberResponse } from '../../../../../services/model/team-member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamMemberService } from '../../../../../services/teamMember/team-member.service';
import { TeamMemberStateService } from '../../../../../statemanagement/team/team-member-state.service';
import { SecureImageDirective } from "../../../../../directives/secure-image/secure-image.directive";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-view-team-member',
  imports: [SecureImageDirective,
    CommonModule,
  ],
  templateUrl: './view-team-member.component.html',
  styleUrl: './view-team-member.component.scss',
})
export class ViewTeamMemberComponent {
  member: TeamMemberResponse | null = null;
  loading = false;
  loadError: string | null = null;

  private memberId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService,
    private state: TeamMemberStateService,
  ) {}

  ngOnInit(): void {
    this.memberId = +this.route.snapshot.paramMap.get('id')!;
    this.loadMember();
  }

  loadMember(): void {
    // State-first: no Api Call if already in memory
    const fromState = this.state
      .teamMembers()
      .find((m) => m.id === this.memberId);
    if (fromState) {
      this.member = fromState;
      return;
    }

    // ── Fallback: fetch from API ────────────────────────────────
    this.loading = true;
    this.loadError = null;

    this.teamMemberService.getById(this.memberId).subscribe({
      next: (data) => {
        this.member = data;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Failed to load member profile. Please try again.';
        this.loading = false;
      },
    });
  }

  onDelete(): void {
    if (!confirm(`Delete ${this.member?.name}? This cannot be undone.`)) return;

    this.teamMemberService.delete(this.memberId).subscribe({
      next: () => {
        this.state.removeTeamMember(this.memberId);
        this.router.navigate(['/admin/teams']);
      },
      error: () => alert('Failed to delete member. Please try again.'),
    });
  }

  goEdit(): void {
    this.router.navigate(['/admin/teams/edit', this.memberId]);
  }

  goBack(): void {
    this.router.navigate(['/admin/teams']);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
