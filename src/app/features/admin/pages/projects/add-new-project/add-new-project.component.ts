import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { toast } from 'ngx-sonner';
import { ProjectService } from '../../../../../services/project/project.service';
import { ProjectStateService } from '../../../../../statemanagement/project/project-state.service';
import { ProjectRequest } from '../../../../../services/model/ProjectRequest.model';
import { ProjectFormComponent } from "../project-form/project-form.component";

@Component({
  selector: 'app-add-new-project',
  imports: [
    ProjectFormComponent
],
  templateUrl: './add-new-project.component.html',
  styleUrl: './add-new-project.component.scss'
})
export class AddNewProjectComponent {
  
    private projectService = inject(ProjectService);
  private state = inject(ProjectStateService);
  private router = inject(Router);
  

  isLoading = false;
  submitting=false;

  create(request: ProjectRequest) {
    this.submitting=true;
    this.isLoading = true;

    console.log("The new project request data: ",request);
    this.projectService.add(request).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res) {
          this.state.addProject(res);
          toast.success('Created',{
            description:"Project add successfully!"
          });
          this.router.navigate(['/admin/projects']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.submitting=false;
        toast.error('Failed to create project');
      }
    });
  }
}
