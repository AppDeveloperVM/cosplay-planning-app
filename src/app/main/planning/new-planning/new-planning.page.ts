import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../cosplays/cosplay-groups/location.model';
import { PlanningService } from '../planning.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {

  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  constructor(
    private loadingCtrl: LoadingController, 
    private planningService: PlanningService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur'
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });

  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  }

  onCreatePlanning() {
    if (!this.form.valid || !this.form.get('image').value ) {
      return;
    }

    this.loadingCtrl
    .create({
      message: 'Creating Planning...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.planningService.uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.planningService.
          addPlanning(
            this.form.value.title,
            this.form.value.description,
            uploadRes.imageUrl,
            this.form.value.location,
            ''
          );
      }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/planning']);
      })
    });
  }

}
