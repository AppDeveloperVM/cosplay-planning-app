import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { ImagePickerComponent } from '../../pickers/image-picker/image-picker.component';

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

//https://stackoverflow.com/questions/37587732/how-to-call-another-components-function-in-angular2

@Component({
  selector: 'app-image-uploader',
  template: `
  <app-image-picker
      [showPreview]="form.get('image').value"
      (imagePick)="onImagePicked($event)">
  </app-image-picker>
  `,
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {}
  
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

    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, imageName);// imageName can be whatever name to image

    //let tarea = await this.fbss.tareaCloudStorage(imageName,datos).then((r) => {
    uploadBytes(storageRef, imageFile).then((snapshot) => {
      getDownloadURL(storageRef).then((url) => {
        console.log(url);
        this.form.patchValue({ image: url });
      });
      
    })
  }

}
