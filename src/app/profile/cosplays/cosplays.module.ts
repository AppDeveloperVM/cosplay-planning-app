import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplaysPageRoutingModule } from './cosplays-routing.module';

import { CosplaysPage } from './cosplays.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplaysPageRoutingModule
  ],
  declarations: [CosplaysPage]
})
export class CosplaysPageModule {}
