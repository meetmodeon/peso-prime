import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: 'img[secureImage]'
})
export class SecureImageDirective implements OnChanges,OnDestroy{
  @Input('secureImage') imageId:number|null =null;

  private readonly BASE_URL=environment.apiUrl+"/public/image/get";
  private currentBlobUrl:string | null=null
  constructor(
    private http:HttpClient,
    private el:ElementRef<HTMLImageElement>
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
   if(changes['imageId']){
    this.revokeCurrentBlob();

    if(this.imageId != null){
      this.loadImage(this.imageId);
    }else{
      this.setFallback();
    }
   }
  }
  private loadImage(id:number):void{
    this.el.nativeElement.src='';

    this.http
    .get(`${this.BASE_URL}/${id}`,{responseType:'blob'})
    .subscribe({
      next:(blob)=>{
        //Create a blob URL - efficient, no base64 encoding overhead
        this.currentBlobUrl=URL.createObjectURL(blob);
        this.el.nativeElement.src=this.currentBlobUrl;
      },
      error:()=>this.setFallback(),
    })
  }

  private setFallback():void{
    //Transparent 1x1 pixel - keeps layout stable,no broken image icon
    this.el.nativeElement.src=
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  }

  private revokeCurrentBlob():void{

    if(this.currentBlobUrl){
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl=null;
    }
  }


  ngOnDestroy(): void {
    this.revokeCurrentBlob();
  }
  

}
