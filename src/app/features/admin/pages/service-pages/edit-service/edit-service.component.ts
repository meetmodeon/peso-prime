import { Component, inject } from '@angular/core';
import { ServiceFormComponent } from "../service-form/service-form.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-service',
  imports: [ServiceFormComponent],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {
  serviceId!:number;
  
  private activeRoute=inject(ActivatedRoute);
  ngOnInit(){
    this.activeRoute.paramMap.subscribe((params:any) => {
    this.serviceId = Number(params.get('id'));
  });
  }
}
