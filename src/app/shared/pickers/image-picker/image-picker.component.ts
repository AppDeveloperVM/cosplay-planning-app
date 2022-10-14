import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Capacitor} from '@capacitor/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  @Input() selectedImage: string;
  imageReady = false;
  usePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('------------------');
    console.log('Mobile : ' + this.platform.is('mobile'));
    console.log('Hybrid : ' + this.platform.is('hybrid'));
    console.log('Android : ' + this.platform.is('android'));
    console.log('Desktop : ' + this.platform.is('desktop'));
    console.log('------------------');    

    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||
     this.platform.is('desktop') ) {
      this.usePicker = true;
    }
  }


  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();
      return;
    }
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt, // Prompt : ask for picture from camera or gallery
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      //selectedImage => src de campo <img>
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
    }).catch(error => {
      console.log(error);
      if (this.usePicker) {
        this.filePicker.nativeElement.click();
      }
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      //selectedImage => src de campo <img>
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
      //this.imageReady = true;
    };
    fr.readAsDataURL(pickedFile);
  }

}
