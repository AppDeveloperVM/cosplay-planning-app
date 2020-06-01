import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopinfoComponent } from './popinfo/popinfo.component';
import { MenuComponent } from './menu/menu.component';



@NgModule({
  declarations: [
    PopinfoComponent,
    MenuComponent
  ],
  exports: [
    MenuComponent,
    PopinfoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
