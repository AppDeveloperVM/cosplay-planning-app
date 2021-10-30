import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupDetailsPageRoutingModule } from './cosplay-group-details-routing.module';

import { CosplayGroupDetailsPage } from './cosplay-group-details.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CosElementModalComponent } from '../../my-cosplays/cosplay-details/cos-element-modal/cos-element-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupDetailsPageRoutingModule,
    SharedModule,
  ],
  declarations: [CosplayGroupDetailsPage],
  entryComponents: [  ]
})
export class CosplayGroupDetailsPageModule {}
