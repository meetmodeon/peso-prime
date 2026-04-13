import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { ProjectRequest } from '../../../../../services/model/ProjectRequest.model';
import { ProjectResponse } from '../../../../../services/model/ProjectResponse.model';
import { toast } from 'ngx-sonner';
import { ImageService } from '../../../../../services/image/image.service';
import { FileType } from '../../../../../services/model/FileType.model';
import { SecureImageDirective } from "../../../../../directives/secure-image/secure-image.directive";

@Component({
  selector: 'app-project-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    SecureImageDirective
],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent {
  form!: FormGroup;
 
  @Input() isEditMode = false;
  @Input() projectData: ProjectResponse | null = null;
 
  // ── UI state ────────────────────────────────────────────────
  @Input() submitting = false;
  @Input() submitError: string | null = null;
  uploadingImages = false;
  
 
  @Output() formSubmit = new EventEmitter<ProjectRequest>();
 
  // ── Scope of work ────────────────────────────────────────────
  // Using an array of objects so Angular can track each item independently
  scopeItems: { value: string }[] = [];
 
  // ── Image state ──────────────────────────────────────────────
  imagePreviews: string[] = [];       // base64 or blob-url previews shown in UI
  uploadedImageIds: number[] = [];    // IDs already on the server (edit mode pre-existing)
  pendingFiles: { file: File; previewIndex: number }[] = []; // files not yet uploaded
 
  // ── Province options ─────────────────────────────────────────
  provinces = [
    { value: 'KOSHI',         label: 'Koshi Province'           },
    { value: 'MADHESH',       label: 'Madhesh Province'         },
    { value: 'BAGMATI',       label: 'Bagmati Province'         },
    { value: 'GANDAKI',       label: 'Gandaki Province'         },
    { value: 'LUMBINI',       label: 'Lumbini Province'         },
    { value: 'KARNALI',       label: 'Karnali Province'         },
    { value: 'SUDURPASHCHIM', label: 'Sudurpashchim Province'   },
  ];
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private imageService:ImageService
  ) {}
 
  ngOnInit(): void {
    this.buildForm();
    if (this.projectData) {
      this.patchForm(this.projectData);
    }
  }
 
  // ── Form builder ─────────────────────────────────────────────
  private buildForm(): void {
    this.form = this.fb.group({
      title:        ['', Validators.required],
      categoryTags: [''],
      province:     ['', Validators.required],
      location:     ['', Validators.required],
      clientName:   ['', Validators.required],
      status:       ['', Validators.required],
      description:  [''],
    });
  }
 
  private patchForm(project: ProjectResponse): void {
    this.form.patchValue({
      title:        project.title,
      categoryTags: project.categoryTags,
      province:     project.province,
      location:     project.location,
      clientName:   project.clientName,
      status:       project.status,
      description:  project.description,
    });
 
    // Wrap each scope string in an object for stable tracking
    this.scopeItems       = project.scopeOfWork.map(v => ({ value: v }));
    this.uploadedImageIds = [...project.imageIds];
 
    // Load existing image previews from server
    project.imageIds.forEach(imageId => this.loadExistingPreview(imageId));
  }
 
  private loadExistingPreview(imageId: number): void {
    this.http
      .get(`${environment.apiUrl}image/get/${imageId}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.imagePreviews.push(url);
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }
 
  // ── Scope of work helpers ────────────────────────────────────
  addScopeItem(): void {
    this.scopeItems.push({ value: '' });
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('.scope-input');
      inputs[inputs.length - 1]?.focus();
    }, 50);
  }
 
  // Called on (input) — mutates the object in-place so Angular doesn't re-render the field
  updateScopeItem(index: number, event: Event): void {
    this.scopeItems[index].value = (event.target as HTMLInputElement).value;
  }
 
  removeScopeItem(index: number): void {
    this.scopeItems.splice(index, 1);
  }
 
  // Helper used in the template to get the plain string array for the preview panel
  get scopeValues(): string[] {
    return this.scopeItems.map(i => i.value);
  }
 
  // ── Image handlers ───────────────────────────────────────────
  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
 
    Array.from(input.files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        this.submitError = `"${file.name}" exceeds 10MB limit.`;
        return;
      }
 
      // Show local preview immediately and record the index it will occupy
      const reader = new FileReader();
      reader.onload = () => {
        const previewIndex = this.imagePreviews.length;
        this.imagePreviews.push(reader.result as string);
        this.pendingFiles.push({ file, previewIndex });
        this.cdr.markForCheck();

        //upload instantly
      this.uploadingImages=true;
        const fileType:FileType='PROJECTS_IMAGES'

        const formData=new FormData();
        formData.set('file',file);
        formData.set('type',fileType);
        this.imageService.uploadImage(formData).subscribe({
          next:(res)=>{
            this.uploadingImages=false;
            this.uploadedImageIds.push(res.id);
            toast.success('Image uploaded successfully');
          },
          error:()=>{
            //rollback preview if upload fails
            this.uploadingImages=false;
            this.imagePreviews.splice(previewIndex,1);
            toast.error('Image upload failed');

          }
        })
      };
      reader.readAsDataURL(file);
    });
 
    // Reset so the same files can be re-selected if needed
    input.value = '';
  }
 
  removeImage(index: number): void {
    const imageId = this.uploadedImageIds[index];
 
    //remove from UI Immediately
    this.imagePreviews.splice(index,1);
    this.uploadedImageIds.splice(index,1);

    if(imageId){
      this.imageService.deleteImage(imageId).subscribe({
        next:()=>{
          toast.success('Image deleted successfully');
        },
        error:()=>{
          toast.error('Failed to delete image');
        }
      })
    }
  }
 
  // ── Submit ───────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.submitting  = true;
    this.submitError = null;
    this.emitRequest(this.uploadedImageIds || []);
    
  }
 
 
 
  private emitRequest(imageIds: number[]): void {
    const request: ProjectRequest = {
      ...this.form.getRawValue(),
      scopeOfWork: this.scopeItems.map(i => i.value).filter(v => v.trim() !== ''),
      imageIds,
    };
    this.formSubmit.emit(request);
  }
 
  // ── Helpers ──────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

}
