import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

 @Input() appHasRole:string[]=[];
 private accountService=inject(AccountService);
 private viewContainerRef=inject(ViewContainerRef);
 private templateRef=inject(TemplateRef);
 ngOnInit(): void {
     if(this.accountService.roles()?.some((role:string)=>this.appHasRole.includes(role))){
       this.viewContainerRef.createEmbeddedView(this.templateRef);

     }else{
       this.viewContainerRef.clear();
     }
 }


}
