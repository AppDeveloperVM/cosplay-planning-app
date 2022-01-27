import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { PlanningService } from '../../../services/planning.service';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../models/location.model';

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
  selector: 'app-edit-planning',
  templateUrl: './edit-planning.page.html',
  styleUrls: ['./edit-planning.page.scss'],
})
export class EditPlanningPage implements OnInit, OnDestroy {
  planning: Planning;
  planningId: string;
  isLoading = false;
  private planningSub: Subscription;
  form: FormGroup;
  actualImage = "";
  actualMapImage = "";
  selectedLocationImage: string;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) { 
    console.log("Entrando en edit planning");
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/planning']); }
    this.planning = navigation?.extras?.state.value;
 
  }

  ngOnInit() {
    

    this.form = new FormGroup({
      title: new FormControl(this.planning.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.planning.description, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      startsAt: new FormControl(this.planning.startsAt, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      endsAt: new FormControl(this.planning.endsAt, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      location: new FormControl(this.planning.location, {validators: [Validators.required]}),
      image: new FormControl(this.planning.imageUrl)
    });
    this.actualImage = this.planning.imageUrl;
    this.actualMapImage = this.planning.location.staticMapImageUrl;
    this.form.patchValue({ image : this.planning.imageUrl });

  }

  //Submit form data ( Planning ) when ready
  onUpdatePlanning() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Updating Planning ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const planning = this.form.value;
      const planningId = this.planning?.id || null;
      this.planningService.onSavePlanning(planning, planningId);
      console.log(planning);

      setTimeout(() => {
        loadingEl.dismiss();
        console.log("Form values: " + this.form);
        //this.form.reset();
        //this.router.navigate(['main/tabs/planning']);
      }, 500);

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

  ngOnDestroy() {
    if (this.planningSub) {
      this.planningSub.unsubscribe();
    }
  }

}
