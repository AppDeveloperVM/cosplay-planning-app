import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupDetailsPageRoutingModule } from './cosplay-group-details-routing.module';

import { CosplayGroupDetailsPage } from './cosplay-group-details.page';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupDetailsPageRoutingModule
  ],
  declarations: [CosplayGroupDetailsPage, CosplayGroupSendRequestComponent],
  entryComponents: [CosplayGroupSendRequestComponent]
})
export class CosplayGroupDetailsPageModule {}
