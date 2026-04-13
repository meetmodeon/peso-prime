import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  TeamMemberRequest,
  TeamMemberResponse,
} from '../../../../../services/model/team-member.model';
import { environment } from '../../../../../../environments/environment.development';
import { ImageService } from '../../../../../services/image/image.service';
import { FileType } from '../../../../../services/model/FileType.model';
import { ImageResponse } from '../../../../../services/model/ImageResponse';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-team-member-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.scss',
})
export class TeamMemberFormComponent {
  @Input() title = 'Add New Member';
  @Input() submitLabel = 'Save Member';
  @Input() submitting = false;
  @Input() error: string | null = null;
  private BASE_URL = environment.apiUrl;

  // Edit mode: parent passes existing member to prefill form
  @Input() existingMember: TeamMemberResponse | null = null;

  // ── Output: emits form value up to parent on submit ────────────────
  @Output() formSubmit = new EventEmitter<TeamMemberRequest>();

  form!: FormGroup;
  previewUrl: string | null = null;
  private selectedFile: File | null = null;
  private existingImageId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private imageServce: ImageService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.existingMember) {
      this.patchForm(this.existingMember);
    }
  }

  // Runs when parent passes existingMember (edit mode data arrives async)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingMember'] && this.existingMember) {
      console.log('The changes data of existingMember: ', this.existingMember);
      this.patchForm(this.existingMember);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      qualifications: ['', Validators.required],
      phone: [''],
      association: ['', Validators.required],
      yearOfExperience: [null, [Validators.required, Validators.min(1)]],
      design: ['', Validators.required],
      bio: [''],
    });
  }

  private patchForm(member: TeamMemberResponse): void {
    if (!this.form) return;

    this.form.patchValue({
      name: member.name,
      qualifications: member.qualifications,
      phone: member.phone,
      association: member.association,
      yearOfExperience: member.yearOfExperience,
      design: member.design,
      bio: member.bio,
    });

    if (member.imageId) {
      this.existingImageId = member.imageId;
      this.loadExistingImagePreview(member.imageId);
    }
  }

  private loadExistingImagePreview(imageId: number): void {
    this.http
      .get(`${this.BASE_URL}/public/image/get/${imageId}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          this.previewUrl = URL.createObjectURL(blob);
        },
        error: () => {},
      });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);

    this.uploadImageThenSave(file);
  }

  private uploadImageThenSave(file:any): void {
    const fileType:FileType='TEAM_MEMBERS_IMAGES'
    const formData = new FormData();
    formData.append('type',fileType);
    formData.append('file', file);
 
    this.imageServce.uploadImage(formData).subscribe({
      next: (res:ImageResponse) => {
        this.existingImageId=res.id;
        toast.success("Image uploaded successfully!");
      },
      error: () => {
        this.error = 'Image upload failed. Please try again.';
        this.submitting = false;
      },
    });
  }
  clearImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.existingImageId = null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // Emit everything up — parent decides what to do with it
    this.formSubmit.emit({
      name: raw.name,
      qualifications: raw.qualifications,
      phone: raw.phone || undefined,
      association: raw.association,
      yearOfExperience: raw.yearOfExperience,
      design: raw.design,
      bio: raw.bio || undefined,
      imageId: this.existingImageId as number
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
