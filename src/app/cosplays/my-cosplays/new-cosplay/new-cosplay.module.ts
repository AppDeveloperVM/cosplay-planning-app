import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCosplayPageRoutingModule } from './new-cosplay-routing.module';

import { NewCosplayPage } from './new-cosplay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCosplayPageRoutingModule
  ],
  declarations: [NewCosplayPage]
})
export class NewCosplayPageModule {}
