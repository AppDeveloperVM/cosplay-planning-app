import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupDetailsPageRoutingModule } from './cosplay-group-details-routing.module';

import { CosplayGroupDetailsPage } from './cosplay-group-details.page';
import { CosplayGroupRequestComponent } from '../cosplay-group-request/cosplay-group-request.component';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupDetailsPageRoutingModule
  ],
  declarations: [CosplayGroupDetailsPage, CosplayGroupRequestComponent, CosplayGroupSendRequestComponent],
  entryComponents: [CosplayGroupRequestComponent, CosplayGroupSendRequestComponent]
})
export class CosplayGroupDetailsPageModule {}
