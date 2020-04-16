import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayDetailsPageRoutingModule } from './cosplay-details-routing.module';

import { CosplayDetailsPage } from './cosplay-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayDetailsPageRoutingModule
  ],
  declarations: [CosplayDetailsPage]
})
export class CosplayDetailsPageModule {}
