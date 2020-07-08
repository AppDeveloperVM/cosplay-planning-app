import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { Router } from '@angular/router';
import { PlaceLocation } from '../location.model';
import { switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
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
  selector: 'app-new-cosplay-group',
  templateUrl: './new-cosplay-group.page.html',
  styleUrls: ['./new-cosplay-group.page.scss'],
})
export class NewCosplayGroupPage implements OnInit {
  form: FormGroup;
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;

  constructor(private cosplayGroupService: CosplayGroupService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    const availableFrom = new Date();
    const availableTo = new Date();

    this.startDate = new Date().toISOString();
    this.endDate = new Date(new Date(this.startDate).getTime()).toISOString();

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      place: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      location: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null)
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
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

  onCreateGroup() {
    if (!this.form.valid || !this.form.get('image').value ) {
      return;
    }

    this.loadingCtrl
    .create({
      message: 'Creating Cosplay Group...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.cosplayGroupService.uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.cosplayGroupService.
            addCosplayGroup(
              this.form.value.title,
              this.form.value.series,
              uploadRes.imageUrl,
              this.form.value.place,
              new Date(this.form.value.dateFrom),
              new Date(this.form.value.dateTo),
              this.form.value.location
            );
      }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplays/cosplay-groups']);
      });
    });

  }

}
