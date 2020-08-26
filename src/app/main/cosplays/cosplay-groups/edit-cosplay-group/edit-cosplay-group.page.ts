import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplayGroupService } from '../cosplay-group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../location.model';

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
  selector: 'app-edit-cosplay-group',
  templateUrl: './edit-cosplay-group.page.html',
  styleUrls: ['./edit-cosplay-group.page.scss'],
})
export class EditCosplayGroupPage implements OnInit, OnDestroy {
  cosplayGroup: CosplayGroup;
  cosplayGroupId: string;
  isLoading = false;
  private cosplayGroupSub: Subscription;
  form: FormGroup;
  selectedLocationImage: string;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplaygroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/cosplay-groups');
        return;
      }
      this.isLoading = true;
      this.cosplayGroupId = paramMap.get('cosplaygroupId');
      this.cosplayGroupSub = this.cosplayGroupService
      .getCosplayGroup(paramMap.get('cosplaygroupId'))
      .subscribe(cosplayGroup => {
        this.cosplayGroup = cosplayGroup;
        // this.selectedLocationImage = new Plac this.cosplayGroup.location;

        this.form = new FormGroup({
          title: new FormControl(this.cosplayGroup.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          series: new FormControl(this.cosplayGroup.series, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
          place: new FormControl(this.cosplayGroup.place, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
          dateFrom: new FormControl(this.cosplayGroup.availableFrom, {
            updateOn: 'blur',
            validators: [ Validators.required]
          }),
          dateTo: new FormControl(this.cosplayGroup.availableTo, {
            updateOn: 'blur',
            validators: [ Validators.required]
          }),
          location: new FormControl(null, {validators: [Validators.required]}),
          image: new FormControl(null)
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load cosplay Group. Try again later.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/main/tabs/cosplays/cosplay-groups']);
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      }
      );

      console.log('Cosplaygroup id: ' + this.cosplayGroup.id);
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

  onUpdateCosplayGroup() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
    .create({
      message: 'Updating Cosplay...'
    }).then(loadingEl => {
      loadingEl.present();
      this.cosplayGroupService.uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.cosplayGroupService.
            updateCosplayGroup(
              this.cosplayGroup.id,
              this.form.value.title,
              this.form.value.series,
              uploadRes.imageUrl,
              this.form.value.place,
              new Date(this.form.value.dateFrom),
              new Date(this.form.value.dateTo),
              this.cosplayGroup.userId,
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

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

}
