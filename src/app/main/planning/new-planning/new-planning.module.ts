import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPlanningPageRoutingModule } from './new-planning-routing.module';

import { NewPlanningPage } from './new-planning.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPlanningPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [NewPlanningPage]
})
export class NewPlanningPageModule {}
