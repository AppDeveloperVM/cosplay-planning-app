import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Capacitor} from '@capacitor/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {

  @ViewChild('filePicker', { static: false }) filePicker: ElementRef<HTMLInputElement>;
  @ViewChild('cropper') cropper: ImageCropperComponent;

  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview: boolean = false;
  @Input() selectedImage: any = '';
  @Input() roundCropper: boolean = false;
  @Input() aspectRatio = "4 / 3";

  imageReady: boolean = false;
  isMobile: boolean = Capacitor.getPlatform() !== 'web';
  isLoading: boolean = false;
  originalImage: any = null;
  myImage: any = null;
  transform: ImageTransform = {};
  isButtonDisabled = false;

  constructor(private platform: Platform, private loadingCtrl : LoadingController,
    private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {
    console.log('------------------');
    console.log('Mobile : ' + this.platform.is('mobile'));
    console.log('Hybrid : ' + this.platform.is('hybrid'));
    console.log('Android : ' + this.platform.is('android'));
    console.log('Desktop : ' + this.platform.is('desktop'));
    console.log('------------------');    

    /* if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||
     this.platform.is('desktop') ) {
      this.usePicker = true;
    } */
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });

      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.originalImage = this.selectedImage;
      this.selectedImage = null;
      this.myImage = `data:image/jpeg;base64,${image.base64String}`;

    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Could not load image',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    } finally {
      this.loadingCtrl.dismiss();
    }
  }

  imageLoaded() {
    this.loadingCtrl.dismiss();
  }
 
  imageCropped(event: ImageCroppedEvent) {
    this.selectedImage = event.base64;
    this.imagePick.emit(this.selectedImage);
  }
 
  async loadImageFailed() {
    const toast = await this.toastCtrl.create({
      message: 'Could not load image',
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  }
 
  async cropImage() {
    this.isButtonDisabled = true;
    await this.cropper.crop();
    this.myImage = null;
    this.isButtonDisabled = false;
  }
 
  async discardChanges() {
    const alert = await this.alertCtrl.create({
      header: 'Discard Changes?',
      message: 'Are you sure you want to discard the changes?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Discard',
          handler: () => {
            this.myImage = null;
            this.selectedImage = this.originalImage;
          }
        }
      ]
    });

  await alert.present();
  }
 
  rotate() {
    const newValue = ((this.transform.rotate ?? 0) + 90) % 360;
 
    this.transform = {
      ...this.transform,
      rotate: newValue,
    };
  }
 
  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }
 
  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }
}
