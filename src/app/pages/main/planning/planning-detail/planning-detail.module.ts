import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanningDetailPageRoutingModule } from './planning-detail-routing.module';

import { PlanningDetailPage } from './planning-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanningDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanningDetailPage]
})
export class PlanningDetailPageModule {}
