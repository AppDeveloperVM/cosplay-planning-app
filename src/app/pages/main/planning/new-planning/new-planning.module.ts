import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPlanningPageRoutingModule } from './new-planning-routing.module';

import { NewPlanningPage } from './new-planning.page';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewPlanningPageRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [NewPlanningPage]
})
export class NewPlanningPageModule {}
