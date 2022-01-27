import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplaysService } from '../../../../services/cosplays.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadImageService } from 'src/app/services/upload-img.service';

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
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;
  isFormReady = false;

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cosplaysService: CosplaysService,
    private uploadService: UploadImageService
  ) {
    console.log("Entrando en edit cosplay");
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/cosplays/my-cosplays']); }
    this.cosplay = navigation?.extras?.state.value;
  }

  ngOnInit() {
    

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
  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    await this.uploadService.decodeFile(imageData)
    .then(
      //Decoded
      async (val) => {
        const maxWidth = 320;
        await this.uploadService.compressFile(val,maxWidth).then(
          async (val) => {
            await this.uploadService.uploadToServer(val,this.form)
            .then(
              //Compressed and Uploaded Img to FireStorage
              (val) => {
                this.form.patchValue({ imageUrl: val })
                console.log("Img Compressed and Uploaded Successfully.")
                this.isFormReady = true;
              },
              (err) => console.error("Uploading error : "+err)
            ).catch(err => {
              console.log(err);
            });
          },
          (err) => console.log("Compressing error : "+err)
        ).catch(err => {
          console.log(err);
        });
      },
      (err) => console.log("Decoding Error: "+err)
    ).catch(err => {
      console.log(err);
    });

  }

  //Submit form data ( Cosplay ) when ready
  onUpdateCosplay() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Updating Cosplay ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosplay = this.form.value;
      const cosplayId = this.cosplay?.id || null;
      this.cosplaysService.onSaveCosplay(cosplay, cosplayId);
      console.log(cosplay);

      setTimeout(() => {
        loadingEl.dismiss();
        //this.form.reset();
        //this.router.navigate(['main/tabs/cosplays/my-cosplays']);
      }, 500);

    });
  }


  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
