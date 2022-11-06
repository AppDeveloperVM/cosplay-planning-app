import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile } from "firebase/auth";
import { UntypedFormGroup, FormGroupDirective, UntypedFormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { Profile } from '../profile.model';
import { ProfilePage } from '../profile.page';
import { UsersService } from 'src/app/services/users.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  profile: Profile;
  public userData : any;
  form: UntypedFormGroup;

  oldImgName = "";
  imageName = "";
  imgSrc = "";
  
  isLoading = false;
  isFormReady = true;
  imageChanged = false;
  
  
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authFire : AngularFireAuth,
    private uploadService: UploadImageService,
    private usersService: UsersService,
    private imgService : UploadImageService,
    private storageService : StorageService
  ) { }

  ngOnInit() {

    this.usersService.getUsers();
    this.isLoading = true;

    this.authFire.currentUser.then( (res) => {
      this.userData = res;

      this.form = new UntypedFormGroup({
        //this.profile.userName,
        displayName: new UntypedFormControl( null, 
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        imageUrl: new UntypedFormControl(this.userData?.photoURL ? this.userData?.photoURL : null)
      });

      this.assignImage();
      this.form.patchValue({ displayName : this.userData?.displayName });
    })


    this.authFire.authState.subscribe((user) => {  
      this.userData = user;
      console.log(user);

      this.form.patchValue({ displayName : user.displayName });

      if(this.userData.photoURL !== null){
        //Use saved info from db
        this.assignImage();
      }

      
      this.isLoading = false;
    }); 

  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  assignImage(){

    this.imageName = this.userData.photoURL;
    this.oldImgName = this.userData.photoURL;

    this.getImageByFbUrl(this.userData.photoURL, 2)
        .then((val)=>{
          console.log('img to assign: ' + val);
          
          this.imgSrc = val;
          //Use saved info from db
          if(this.form.get('imageUrl').value == null && this.userData.photoURL != null){
            this.form.patchValue({ imageUrl: this.userData.photoURL })
          }
        })
        .catch( (err) => {
          console.log('error obtaining data  : ' + err);
        });

  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    this.uploadService
    .fullUploadProcess(imageData,this.form)
    .then((val) =>{
      const name = val.split('_')[0];
      this.imageName = name;
      this.getImageByFbUrl(this.imageName, 2)
      .then( (res) => {
        this.imgSrc = res;
        this.imageChanged = true;
        this.isFormReady = true;
        console.log('imgSrc : ' + res);
      } )
      .catch();
  
      console.log("formReady, img src : "+ name );
    })
    .catch(err => {
      console.log(err);
    });

  }

  onUpdateProfile() {
    if (!this.form.valid) return;

    this.loadingCtrl
    .create({
      message: 'Updating profile ...'
    })
    .then(loadingEl => {
      loadingEl.present();

      this.usersService.onUpdateUserProfile( this.form.get('displayName').value , this.imageName )
      .then( (res) => {
        console.log('Profile updated! : ' + res); 
        console.log('img : ',this.imageName);
        if(this.imageChanged){
          this.storageService.deleteThumbnail(this.oldImgName);
        }
      })
      .catch( (err) => {
        console.log(err);
      })
      .finally(
        
      );

      setTimeout(() => { 
        loadingEl.dismiss();
      }, 500);  
      
    });

  }

}
