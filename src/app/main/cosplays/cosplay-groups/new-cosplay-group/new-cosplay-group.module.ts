import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCosplayGroupPageRoutingModule } from './new-cosplay-group-routing.module';

import { NewCosplayGroupPage } from './new-cosplay-group.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewCosplayGroupPageRoutingModule
  ],
  declarations: [NewCosplayGroupPage]
})
export class NewCosplayGroupPageModule {}
