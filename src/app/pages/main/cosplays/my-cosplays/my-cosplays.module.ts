import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCosplaysPageRoutingModule } from './my-cosplays-routing.module';

import { MyCosplaysPage } from './my-cosplays.page';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CosplayItemComponent } from './cosplay-item/cosplay-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCosplaysPageRoutingModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [MyCosplaysPage, CosplayItemComponent]
})
export class MyCosplaysPageModule {}
