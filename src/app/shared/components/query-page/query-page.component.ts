import { Component, Input } from '@angular/core';
import { DialogModule, Dialog } from 'primeng/dialog';
import { DialogService } from '../../../services/query-dialogbox/dialog.service';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactQueryService } from '../../../services/contact-query/contact-query.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-query-page',
  standalone:true,
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './query-page.component.html',
  styleUrl: './query-page.component.scss'
})
export class QueryPageComponent {
  @Input() buttonType:string='';
  contactForm!:FormGroup;


 constructor(
  private dialogService:DialogService,
  private fb:FormBuilder,
  private contactQueryService:ContactQueryService
){}

ngOnInit():void{
  this.contactForm=this.fb.group({
    fullName:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address:[''],
    subject:['',[Validators.required]],
    message:['',[Validators.required,Validators.maxLength(2000)]]
  });
}
get f():any{
  return this.contactForm.controls;
}

onSubmit(){
  if(this.contactForm.invalid){
    this.contactForm.markAllAsTouched();
    return;
  }
 
  this.contactQueryService.addContactQuery(this.contactForm.value).subscribe({
    next:(res)=>{
      toast.success(`${res.email} form submitted successfully!Please check your Email`);
      this.contactForm.reset();
    },
    error:(err:Error)=>{
      toast.error("Failed to submit form"+err)
    }
  })
  if(this.buttonType==='close'){
    this.closeDialog();
  }
}

 closeDialog(){
  this.contactForm.reset();
  this.dialogService.closeDialog();
 }
}
