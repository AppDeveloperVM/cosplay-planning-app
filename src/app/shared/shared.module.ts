import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';

import { MapModalLeafletComponent } from './map-modal-leaflet/map-modal-leaflet.component';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PlanningItemComponent } from '../pages/main/planning/planning-item/planning-item.component';
import { CosgroupEditModalComponent } from './cosgroup-edit-modal/cosgroup-edit-modal.component';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent, HeaderComponent, CosgroupEditModalComponent],
    imports: [CommonModule, IonicModule, RouterModule, ImageCropperModule],
    exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent, HeaderComponent, CosgroupEditModalComponent]
})

export class SharedModule {}
