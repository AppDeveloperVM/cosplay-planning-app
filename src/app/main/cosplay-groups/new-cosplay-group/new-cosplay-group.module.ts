import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCosplayGroupPageRoutingModule } from './new-cosplay-group-routing.module';

import { NewCosplayGroupPage } from './new-cosplay-group.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewCosplayGroupPageRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [NewCosplayGroupPage]
})
export class NewCosplayGroupPageModule {}
