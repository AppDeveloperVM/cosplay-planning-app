import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopinfoComponent } from './popinfo/popinfo.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';



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
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
