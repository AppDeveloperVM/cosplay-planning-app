import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../models/location.model';
import { PlanningService } from '../../../services/planning.service';
//FireBase
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadImageService } from '../../../services/upload-img.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { PlanningInterface } from 'src/app/models/planning.interface';

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

  planning: PlanningInterface;

  constructor(
    private loadingCtrl: LoadingController,
    private planningService: PlanningService,
    private router: Router,
    private fbss: FirebaseStorageService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.planning = navigation?.extras?.state?.value;
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur'
      }),
      startsAt: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      endsAt: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
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

  async onImagePicked(imageData: string | File) {
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
      //this.form.patchValue({image: imageFile});
      //UPLOAD IMAGE
      const imageName = "images/"+Math.random()+imageFile;
      const datos = imageFile;

      let tarea = await this.fbss.tareaCloudStorage(imageName,datos).then((r) => {

      this.form.patchValue({ image: '' });
    })
  }

  onSavePlanning() {
    //this.cosplayGroupService.uploadImage(this.form.get('image').value)
    //if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Planning...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosGroup = this.form.value;
      const cosGroupId = this.planning?.id || null;
      this.planningService.onSavePlanning(cosGroup, cosGroupId)

      loadingEl.dismiss();
      this.form.reset();
      this.router.navigate(['main/tabs/planning']);
    });
    
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
            '',
            new Date(this.form.value.startsAt),
            new Date(this.form.value.endsAt),
            ''
          );
      }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/main/tabs/planning']);
      });
    });
  }

}
