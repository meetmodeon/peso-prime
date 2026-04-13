import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../../../services/service/services.service';
import { ServiceStateService } from '../../../../../statemanagement/service/service-state.service';
import { toast } from 'ngx-sonner';
import { FileType, ServiceType } from '../../../../../services/model/FileType.model';
import { ImageService } from '../../../../../services/image/image.service';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';
@Component({
  selector: 'app-service-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SecureImageDirective
],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent {

  @Input() isEditMode=false;
  @Input() serviceId!:number;
  imageId :number|null|undefined=null;

  form!:FormGroup;
  submitting=false;
  serviceTypes=Object.values(ServiceType);
  imagePreview:string | null=null;

  constructor(
    private fb:FormBuilder,
    private serviceApi: ServicesService,
    private state:ServiceStateService,
    private imageService:ImageService,
    private router:Router
  ){}

  ngOnInit():void{
    this.initForm();
    if(this.isEditMode){
      this.loadService(this.serviceId);
    }
  }


  initForm(){
    this.form=this.fb.group({
      title:['',Validators.required],
      type:['',Validators.required],
      description:[''],
      imageId:[null],

      processSteps: this.fb.array([],Validators.required),
      equipments:this.fb.array([],Validators.required),
      deliverables: this.fb.array([],Validators.required),
    });

  }

  //Load Data for edit

  loadService(id:number){

    this.serviceApi.getServiceById(id).subscribe((data)=>{
     
      this.imageId=data.imageId;
      this.form.patchValue({
        title:data.title,
        type:data.type,
        description:data.description,
        imageId:data.imageId,
      });

      data.processSteps?.forEach((x:string)=>this.processSteps.push(this.fb.control(x)));
      data.equipments.forEach((x:string)=>this.equipments.push(this.fb.control(x)));
      data.deliverables.forEach((x:string)=>this.deliverables.push(this.fb.control(x)));
      
    });
  }

  get processSteps():FormArray{
    return this.form.get('processSteps') as FormArray;
  }

  get equipments():FormArray{
    return this.form.get('equipments') as FormArray;
  }

  get deliverables():FormArray{
    return this.form.get('deliverables') as FormArray;
  }

  asFormControl(control:any):FormControl{
    return control as FormControl;
  }

  addProcessStep(){
    this.processSteps.push(this.fb.control('',Validators.required));
  }

  removeProcessStep(i:number){
    this.processSteps.removeAt(i);
  }

  addEquipment(){
    this.equipments.push(this.fb.control('',Validators.required));
  }

  removeEquipment(i:number){
    this.equipments.removeAt(i);
  }

  addDeliverable(){
    this.deliverables.push(this.fb.control('',Validators.required));
  }

  removeDeliverable(i:number){
    this,this.deliverables.removeAt(i);
  }

  onImageSelected(event:any){
    const file:File=event.target.files[0];
    if(!file) return;
    if(file.size>2*1024*1024) {
      toast.error("Image size is too large");
      return;
    };

    const reader=new FileReader();
    reader.onload=()=>{
      this.imagePreview=reader.result as string;
    }
    reader.readAsDataURL(file);

    //upload
    this.uploadImage(file);
  }

  private uploadImage(file:File){
    const formData=new FormData();
    const fileType:FileType='SERVICES_IMAGES';
    formData.append('file',file);
    formData.append('type',fileType);
    this.imageService.uploadImage(formData).subscribe({
      next:(res)=>{
        this.imageId=res.id;
        this.form.patchValue({
          imageId:this.imageId
        });
        toast.success('Uploaded image successfully');
      },
      error:()=>toast.error('Failed to upload image')
    })
  }


  //Validation
  isInvalid(field:string):boolean{
    const control=this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched))
  }

  //Submit
  onSubmit(){
    if(this.form.invalid) return;

    this.submitting=true;
    const payload = this.form.value;

    if(this.isEditMode){
      this.serviceApi.updateServiceById(this.serviceId as number,payload).subscribe({
        next:(res)=>{
          this.state.updateService(res);
          this.submitting=false;
          toast.success('Updated service Successfully');

          this.router.navigate(['/admin/services']);
        },
        error:()=>{
          this.submitting=false;
          toast.error('Failed to upload service');
        }
      })
    }else{
      this.serviceApi.addService(payload).subscribe({
        next:(res)=>{
          this.submitting=false;
          this.state.addService(res);
          toast.success("Service add successfully!");
          this.router.navigate(['/admin/services'])
        },
        error:()=>{
          toast.error("Failed to add service");
          this.submitting=false;
        }
      })
    }
  }
}
