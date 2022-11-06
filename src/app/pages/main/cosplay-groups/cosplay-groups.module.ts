import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosplayGroupsPageRoutingModule } from './cosplay-groups-routing.module';

import { CosplayGroupsPage } from './cosplay-groups.page';
import { CosplayGroupItemComponent } from './cosplay-group-item/cosplay-group-item.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CosplayGroupsPageRoutingModule,
        SharedModule
    ],
    declarations: [CosplayGroupsPage, CosplayGroupItemComponent]
})
export class CosplayGroupsPageModule {}
