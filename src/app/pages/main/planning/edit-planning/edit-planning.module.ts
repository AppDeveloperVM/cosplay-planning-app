import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPlanningPageRoutingModule } from './edit-planning-routing.module';

import { EditPlanningPage } from './edit-planning.page';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditPlanningPageRoutingModule,
    SharedModule
  ],
  declarations: [EditPlanningPage]
})
export class EditPlanningPageModule {}
