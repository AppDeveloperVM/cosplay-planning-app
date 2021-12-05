import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
