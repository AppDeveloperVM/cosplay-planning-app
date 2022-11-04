import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile } from "firebase/auth";
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { Profile } from '../profile.model';
import { ProfilePage } from '../profile.page';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  profile: Profile;
  public userData : any;
  form: FormGroup;
  isLoading = false;
  isFormReady = true;
  imageName = "";
  imgSrc = "";
  
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authFire : AngularFireAuth,
    private uploadService: UploadImageService,
    private usersService: UsersService,
    private imgService : UploadImageService
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.authFire.currentUser.then( (res) => {
      this.userData = res;

      this.form = new FormGroup({
        //this.profile.userName,
        displayName: new FormControl( null, 
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        imageUrl: new FormControl(this.userData?.photoURL ? this.userData?.photoURL : null)
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
        console.log('imgSrc : ' + res);
      } )
      .catch();

      this.isFormReady = true;
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
      /* const cosplay = this.form.value;
      const cosplayId = this.cosplay?.id || null;
      this.cosplaysService.onSaveCosplay(cosplay, cosplayId);
      console.log(cosplay);

      setTimeout(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplays/my-cosplays']);
      }, 500);   
      */   

      this.usersService.onUpdateUserProfile( this.form.get('displayName').value , this.imageName )
      .then( (res) => {
        console.log('Profile updated! : ' + res); 
        console.log('img : ',this.imageName);
      } )
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
