import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCosplayGroupPageRoutingModule } from './edit-cosplay-group-routing.module';

import { EditCosplayGroupPage } from './edit-cosplay-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCosplayGroupPageRoutingModule
  ],
  declarations: [EditCosplayGroupPage]
})
export class EditCosplayGroupPageModule {}
