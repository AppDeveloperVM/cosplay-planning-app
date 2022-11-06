import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupDetailsPageRoutingModule } from './cosplay-group-details-routing.module';

import { CosplayGroupDetailsPage } from './cosplay-group-details.page';
import { SharedModule } from '../../../../shared/shared.module';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CosplayGroupDetailsPageRoutingModule,
        SharedModule
    ],
    declarations: [CosplayGroupDetailsPage]
})
export class CosplayGroupDetailsPageModule {}
