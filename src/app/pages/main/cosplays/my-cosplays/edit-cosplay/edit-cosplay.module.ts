import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCosplayPageRoutingModule } from './edit-cosplay-routing.module';

import { EditCosplayPage } from './edit-cosplay.page';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditCosplayPageRoutingModule,
    SharedModule
  ],
  declarations: [EditCosplayPage]
})
export class EditCosplayPageModule {}
