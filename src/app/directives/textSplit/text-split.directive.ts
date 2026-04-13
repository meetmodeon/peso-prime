import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTextSplit]'
})
export class TextSplitDirective {

  @Input('appSpliteText') text:string='';
  @Input('appSpliteTextIndex') index:number=0;
  constructor(
    private templateRef:TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnChanges(){
    this.viewContainer.clear();


    if(!this.text) return;

    const parts= this.text.split(' ');
    const value=parts[this.index]??'';

    this.viewContainer.createEmbeddedView(this.templateRef,{
      $implicit: value
    });
  }

}
