import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConventionsPageRoutingModule } from './conventions-routing.module';

import { ConventionsPage } from './conventions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConventionsPageRoutingModule
  ],
  declarations: [ConventionsPage]
})
export class ConventionsPageModule {}
