import { Component, inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { ProjectRequest } from '../../../../../services/model/ProjectRequest.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../../services/project/project.service';
import { ProjectStateService } from '../../../../../statemanagement/project/project-state.service';
import { ProjectResponse } from '../../../../../services/model/ProjectResponse.model';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from "../project-form/project-form.component";

@Component({
  selector: 'app-edit-project',
  imports: [
    CommonModule,
    ProjectFormComponent
],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private state = inject(ProjectStateService);

  project: ProjectResponse | null = null;
  projectId!: number;

  isLoading = false;
  submitting=false;

  ngOnInit() {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;

    // try state first
    const cached = this.state.projects().find(p => p.id === this.projectId);

    if (cached) {
      this.project = cached;
    } else {
      this.projectService.getById(this.projectId).subscribe({
        next: (res) => {
            this.project = res;
        }
      });
    }
  }

  update(request: ProjectRequest) {
    this.isLoading = true;
    this.submitting=true;

    this.projectService.update(this.projectId, request).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.submitting=false;

          this.state.updateProject(res);
          toast.success('Ok',{
            description:"Project updated successfully"
          });
          this.router.navigate(['/admin/projects']);
        
      },
      error: () => {
        this.isLoading = false;
        this.submitting=false;
        toast.error('Failed to update project');
      }
    });
  }

}
