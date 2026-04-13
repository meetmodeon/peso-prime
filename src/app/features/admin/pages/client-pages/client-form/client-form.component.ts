import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientRequest } from '../../../../../services/model/Client.model';
import { ImageService } from '../../../../../services/image/image.service';
import { FileType } from '../../../../../services/model/FileType.model';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SecureImageDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {

  form!: FormGroup;
 
  // ── Mode ──────────────────────────────────────────────────────
  @Input() isEditMode = false;
  @Input() initialData:any = null;
  @Output() formSubmit = new EventEmitter<ClientRequest>();
  clientId: number | null = null;
  
  clientImagePreview: string | null=null;
  companyLogoPreview: string | null = null;

 
  // ── UI state ──────────────────────────────────────────────────
  loading    = false;   // true while fetching existing client in edit mode
  submitting = false;
  submitError: string | null = null;
 
  constructor(
    private fb:      FormBuilder,
    private imageService:ImageService
  ) {}
 
  ngOnInit(): void {
    this.buildForm();
    if(this.initialData && this.form){
      this.form.patchValue({
        name: this.initialData.name,
        position: this.initialData.position,
        companyName: this.initialData.companyName,
        description: this.initialData.description,
        clientImageId: this.initialData.clientImageId,
        companyLogoId: this.initialData.companyLogoId
      });
    }
  }

 
  // ── Build ─────────────────────────────────────────────────────
  private buildForm(): void {
    this.form = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(2)]],
      position:    [''],
      companyName:     [''],
      description: [''],
      companyLogoId: [null],
      clientImageId: [null]
    });
  }

  onClientImageChange(event:any):void{
    const file= event.target.files[0];
    if(!file) return;
    
    if(file.size>2*1024*1024){
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>(this.clientImagePreview=reader.result as string);
    reader.readAsDataURL(file);
    
    const type:FileType='CLIENT_IMAGES';
    const formData= new FormData();
    formData.append('file',file);
    formData.append('type',type);

    this.imageService.uploadImage(formData).subscribe({
      next:(res)=>{
        this.form.patchValue({clientImageId: res.id});
        toast.success('Client image uploaded successfully')
      },
      error:()=>toast.error('Failed to upload client image')
    })
  }

  //Company Logo upload
  onCompanyLogoChange(event:any):void{
    const file= event.target.files[0];
    if(!file) return;

    const reader=new FileReader();
    reader.onload=()=>(this.companyLogoPreview=reader.result as string);
    reader.readAsDataURL(file);

    const formData=new FormData();
    const type:FileType='CLIENT_IMAGES';
    formData.append('file',file);
    formData.append('type',type);

    this.imageService.uploadImage(formData).subscribe({
      next:(res)=>{
        this.form.patchValue({companyLogoId: res.id});
        toast.success('Company logo upload successfully!')
      },
      error:()=>toast.error('Failed to upload company logo')
    })
  }

 
  // ── Submit ────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.submitting  = true;
    this.submitError = null;
 
    const payload: ClientRequest = {
      ...this.form.getRawValue(),
      description: this.form.value.description || undefined,
    };
 
    this.formSubmit.emit(payload);
  }
 
  // ── Helpers ───────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
 
  errorMsg(field: string): string {
    const ctrl = this.form.get(field) as AbstractControl;
    if (!ctrl || !ctrl.touched || !ctrl.errors) return '';
 
    if (ctrl.errors['required'])   return `${this.fieldLabel(field)} is required.`;
    if (ctrl.errors['minlength'])  return `${this.fieldLabel(field)} must be at least ${ctrl.errors['minlength'].requiredLength} characters.`;
    return 'Invalid value.';
  }
 
  private fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      position: 'Position', companyName: 'Company'
    };
    return labels[field] ?? field;
  }
 
  /** Preview initials for the avatar shown in the summary panel */
  get initials(): string {
    const name: string = this.form.get('name')?.value ?? '';
    return name.trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() || '?';
  }

}
