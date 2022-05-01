import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayDetailsPageRoutingModule } from './cosplay-details-routing.module';

import { CosplayDetailsPage } from './cosplay-details.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CosElementDetailsModalComponent } from './cos-element-modal-details/cos-element-details-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [CosplayDetailsPage, CosElementDetailsModalComponent],
  entryComponents:[CosElementDetailsModalComponent ]
})
export class CosplayDetailsPageModule {}
