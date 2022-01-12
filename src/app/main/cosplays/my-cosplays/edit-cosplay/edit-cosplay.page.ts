import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplaysService } from '../../../../services/cosplays.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  selector: 'app-edit-cosplay',
  templateUrl: './edit-cosplay.page.html',
  styleUrls: ['./edit-cosplay.page.scss'],
})
export class EditCosplayPage implements OnInit, OnDestroy {
  cosplay: Cosplay;
  cosplayId: string;
  private cosplaySub: Subscription;
  isLoading = false;
  form: FormGroup;
  actualImage = "";

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('main/tabs/cosplays/my-cosplays');
        return;
      }
      this.cosplayId = paramMap.get('cosplayId');
      this.isLoading = true;
      this.cosplaySub = this.cosplayService
      .getCosplay(paramMap.get('cosplayId'))
      .subscribe(cosplay => {
        this.cosplay = cosplay;
        this.form = new FormGroup({
          characterName: new FormControl(this.cosplay.characterName , {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          series: new FormControl(this.cosplay.series, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
          description: new FormControl(this.cosplay.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
          image: new FormControl(null)
        });
        this.actualImage = this.cosplay.imageUrl;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error ocurred!',
          message: 'Cosplay could not be fetched. Try again later',
          buttons:  [{text: 'Okay',
          handler: () => {
            this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
          }}] })
      .then(alertEl => {
        alertEl.present();
      });
      });

    });
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
    this.form.get('image').value;
  }

  onUpdateCosplay() {
    if (!this.form.valid) {
      return;
    }
    console.log('cosplay id:' + this.cosplay.id + ', cosplay char:' + this.cosplay.characterName);

    this.loadingCtrl
    .create({
      message: 'Updating Cosplay...'
    }).then(loadingEl => {
      loadingEl.present();
      this.cosplayService.uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.cosplayService.
            updateCosplay(
              this.cosplay.id,
              this.form.value.characterName,
              this.form.value.description,
              uploadRes.imageUrl,
              this.form.value.series,
              this.cosplay.funds,
              this.cosplay.percentComplete,
              this.cosplay.status,
              this.cosplay.userId
            );
        }))
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['main/tabs/cosplays/my-cosplays']);
        });
    });

  }

  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
