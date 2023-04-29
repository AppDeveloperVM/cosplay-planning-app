import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, ToastController } from '@ionic/angular';

import { MyCosplaysPageRoutingModule } from './my-cosplays-routing.module';

import { MyCosplaysPage } from './my-cosplays.page';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CosplayItemComponent } from './cosplay-item/cosplay-item.component';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, IntersectionObserverHooks, Attributes } from 'ng-lazyload-image';
import { from, ObservableInput } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  
  constructor(private toastCtrl : ToastController) {
    super();
  }

  setup(attributes : Attributes){
    attributes.offset = 10;
    attributes.defaultImagePath = './../../assets/avatar.png';
    attributes.errorImagePath = './../../assets/avatar.png';
    return super.setup(attributes);
  }

  /* loadImage({ imagePath }: Attributes): Promise<string> {
    return fetch(imagePath, {
      headers: {
        Authorization: 'Bearer ...',
        'Access-Control-Allow-Headers': '*'
      },
    })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  } */

  

  /* async loadImage({ imagePath }: Attributes): Promise<string> {
    return await fetch(imagePath)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  } */
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCosplaysPageRoutingModule,
    RouterModule,
    LazyLoadImageModule,
    SharedModule,
    LazyLoadImageModule
  ],
  declarations: [MyCosplaysPage, CosplayItemComponent],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }],

})
export class MyCosplaysPageModule {}
