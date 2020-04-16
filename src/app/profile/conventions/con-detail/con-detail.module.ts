import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConDetailPageRoutingModule } from './con-detail-routing.module';

import { ConDetailPage } from './con-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConDetailPageRoutingModule
  ],
  declarations: [ConDetailPage]
})
export class ConDetailPageModule {}
