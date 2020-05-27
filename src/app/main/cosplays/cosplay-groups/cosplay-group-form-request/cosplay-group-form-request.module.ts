import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupFormRequestPageRoutingModule } from './cosplay-group-form-request-routing.module';

import { CosplayGroupFormRequestPage } from './cosplay-group-form-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupFormRequestPageRoutingModule
  ],
  declarations: [CosplayGroupFormRequestPage],
  entryComponents: [ ]
})
export class CosplayGroupFormRequestPageModule {}
