import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupsPageRoutingModule } from './cosplay-groups-routing.module';

import { CosplayGroupsPage } from './cosplay-groups.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosplayGroupsPageRoutingModule
  ],
  declarations: [CosplayGroupsPage]
})
export class CosplayGroupsPageModule {}
