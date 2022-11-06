import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCosplayGroupPageRoutingModule } from './edit-cosplay-group-routing.module';

import { EditCosplayGroupPage } from './edit-cosplay-group.page';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditCosplayGroupPageRoutingModule,
    SharedModule
  ],
  declarations: [EditCosplayGroupPage]
})
export class EditCosplayGroupPageModule {}
