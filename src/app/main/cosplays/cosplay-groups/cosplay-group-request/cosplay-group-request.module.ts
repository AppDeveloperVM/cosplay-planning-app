import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupRequestPageRoutingModule } from './cosplay-group-request-routing.module';

import { CosplayGroupRequestPage } from './cosplay-group-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupRequestPageRoutingModule
  ],
  declarations: [CosplayGroupRequestPage]
})
export class CosplayGroupRequestPageModule {}
