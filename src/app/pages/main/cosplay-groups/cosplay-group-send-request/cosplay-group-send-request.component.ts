import { Component, OnInit, Input } from '@angular/core';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { CosplayGroup } from '../cosplay-group.model';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Cosplay } from '../../../../models/cosplay.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticesService } from 'src/app/services/notices.service';
import { UntypedFormControl, ReactiveFormsModule, UntypedFormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { CharacterMember } from 'src/app/models/characterMember.model';
import { CosGroupMember } from 'src/app/models/cosGroupMember.interface';
import { CosplayGroupService } from 'src/app/services/cosplay-group.service';

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
  selector: 'app-cosplay-group-send-request',
  templateUrl: './cosplay-group-send-request.component.html',
  styleUrls: ['./cosplay-group-send-request.component.scss'],
})
export class CosplayGroupSendRequestComponent implements OnInit {
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() requestedCharacter: Cosplay;
  notifications: any = [];
  private notifications$ = this.noticesService.notices$;


  form: UntypedFormGroup;
  version: string;
  selectOptions: any = [
    {id : 'original', name: 'Original'},
    {id : 'version', name: 'Version Especifica'}
  ];
  DefaultVersionValue = "original";
  compareWith : any ;
  versionInputHidden: boolean = true;
  cosGroupMemberRequest: CosGroupMember;

  //Select options - Compare values for default
  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private noticesService: NoticesService,
    private cosplayGroupService: CosplayGroupService,
    private fbss: FirebaseStorageService
  ) { }

  ngOnInit() {
    this.DefaultVersionValue= "2" ;
    this.compareWith = this.compareWithFn;
    
    this.notifications$.subscribe((data)=> {
      console.log(data);
      this.notifications = data;
    })

    this.form = new UntypedFormGroup({
      characterName: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      version: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      versionName: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(180)]
      }),
      image: new UntypedFormControl(null),
      asistanceConfirmed: new UntypedFormControl(false),
      requestConfirmed: new UntypedFormControl(false)
    });
    this.onSetOriginalVersion();
  }

  onSetOriginalVersion() {
    this.form.controls['version'].setValue('original');
  }

  onSelectChange($event) {
    console.log($event.target.value);
    //this.SelectedYearIdValue = selectedValue.detail.value ;
    if($event.target.value == 'version'){
      this.versionInputHidden = false;
    }else{
      this.versionInputHidden = true;
    }
    
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
      this.form.patchValue({ image: r.ref.getDownloadURL() });
    })

  }
  

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  
  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;

    console.log(form.value)
    this.onSendCosplayGroupRequest();
  }

  onSendCosplayGroupRequest() {
    
    this.loadingCtrl
    .create({
      message: 'Creating Cosplay Group...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosGroup = this.form.value;
      const cosGroupId = this.selectedCosplayGroup?.id || null;
      this.cosplayGroupService.onSaveCosGroupRequest(cosGroup, cosGroupId)

      //add actual User name (this session)
      this.noticesService.addNotice( "Requested: " + this.form.get('characterName').value , 'cosplay', 'request', this.selectedCosplayGroup.title );      
      this.noticesService.getNotices();

      loadingEl.dismiss();
      this.form.reset();
      this.modalCtrl.dismiss({ message: 'Request Send !'}, 'confirm');
    });
    
    
  }

}
