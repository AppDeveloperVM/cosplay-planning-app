import { NgModule } from '@angular/core';
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
import { PopoverComponent } from 'app/components/popover/popover.component';
import { GeolocationPickerComponent } from './pickers/geolocation-picker/geolocation-picker.component';
import { DatetimePickerComponent } from './pickers/datetime-picker/datetime-picker.component';

import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
    declarations: [GeolocationPickerComponent, MapModalComponent, ImagePickerComponent, DatetimePickerComponent, HeaderComponent, CosgroupEditModalComponent, PopoverComponent],
    imports: [CommonModule, IonicModule, RouterModule, ImageCropperModule, LazyLoadImageModule],
    exports: [GeolocationPickerComponent, MapModalComponent, ImagePickerComponent, DatetimePickerComponent, HeaderComponent, CosgroupEditModalComponent, PopoverComponent],
})

export class SharedModule {}
