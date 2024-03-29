import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayDetailsPageRoutingModule } from './cosplay-details-routing.module';

import { CosplayDetailsPage } from './cosplay-details.page';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CosplayDetailsPageRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [CosplayDetailsPage]
})
export class CosplayDetailsPageModule {}
