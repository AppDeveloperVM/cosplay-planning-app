import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';

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
  selector: 'app-new-cosplay',
  templateUrl: './new-cosplay.page.html',
  styleUrls: ['./new-cosplay.page.scss'],
})
export class NewCosplayPage implements OnInit {
  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  cosplay: Cosplay;
  imgReference;
  public URLPublica = '';

  constructor(
    private modalController: ModalController,
    private cosplaysService: CosplaysService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private fbss: FirebaseStorageService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    //this.cosGroup = navigation?.extras?.state?.value;

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      characterName: new FormControl('', Validators.required),
      series: new FormControl('', Validators.required),
      description: new FormControl(''),
      image: new FormControl(null)
    });
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

  onSubmitCosplay() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Cosplay ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosplay = this.form.value;
      const cosplayId = this.cosplay?.id || null;
      this.cosplaysService.onSaveCosplay(cosplay, cosplayId);

      loadingEl.dismiss();
      this.form.reset();
      this.router.navigate(['main/tabs/cosplays/my-cosplays']);
    });
  }

  onCreateCosplay() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      message: 'Creating Cosplay...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.cosplaysService.
      uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.cosplaysService
          .addCosplay(
            this.form.value.characterName,
            this.form.value.description,
            uploadRes.imageUrl,
            this.form.value.series,
            0,
            '0',
            false
          );
        }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
      });
    });

  }

}
