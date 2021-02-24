import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent,HeaderComponent ],
  imports: [ CommonModule, IonicModule,RouterModule ],
  exports: [ LocationPickerComponent, MapModalComponent, ImagePickerComponent,HeaderComponent ],
  entryComponents: [ MapModalComponent]
})

export class SharedModule {}
