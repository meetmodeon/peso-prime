import { Component } from '@angular/core';
import { ProjectResponse } from '../../../../../services/model/ProjectResponse.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';

@Component({
  selector: 'app-view-project',
  imports: [
    CommonModule,
    SecureImageDirective,
    RouterLink
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss',
})
export class ViewProjectComponent {
  project: ProjectResponse|null= null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(+id);
    }
  }

  loadProject(id: number): void {
    this.loading = true;
    this.projectService.getById(id).subscribe({
      next: (value) => {
        console.log(value);
        this.project = value;
        this.loading = false;
      },
      error: (err) => {
        console.log(err)
        this.error = 'Failed to load project';
        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ONGOING':
        return 'bg-blue-100 text-blue-600';
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      case 'PENDING':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
