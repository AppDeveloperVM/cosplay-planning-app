import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCosplayPageRoutingModule } from './edit-cosplay-routing.module';

import { EditCosplayPage } from './edit-cosplay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCosplayPageRoutingModule
  ],
  declarations: [EditCosplayPage]
})
export class EditCosplayPageModule {}
