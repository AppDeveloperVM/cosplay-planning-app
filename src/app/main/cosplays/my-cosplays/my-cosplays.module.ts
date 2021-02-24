import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCosplaysPageRoutingModule } from './my-cosplays-routing.module';

import { MyCosplaysPage } from './my-cosplays.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCosplaysPageRoutingModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [MyCosplaysPage]
})
export class MyCosplaysPageModule {}
