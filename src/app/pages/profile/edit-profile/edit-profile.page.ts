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
  actualImage = "";
  
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authFire : AngularFireAuth,
    private uploadService: UploadImageService,
    private usersService: UsersService,
    private imgService : UploadImageService
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      //this.profile.userName,
      displayName: new FormControl({
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      photoURL: new FormControl(null)
    });

    this.isLoading = true;

    const auth = getAuth();
    updateProfile(auth.currentUser, {
      
    })

    this.authFire.authState.subscribe((user) => {  
      this.userData = user;
      console.log(user);

      this.form.patchValue({ displayName : user.displayName });

      if(this.userData.photoURL !== null){
        //Use saved info from db
        this.getImageByFbUrl(this.userData.photoURL, 2)
        .then((val)=>{
          this.actualImage = val;
          //Use saved info from db
          if(this.form.get('photoURL').value == null && this.userData.photoURL != null){
            this.form.patchValue({ photoURL: this.userData.photoURL })
          }
        })
        .catch( (err) => {
          console.log('error obtaining data  : ' + err);
        });
      }

      
      this.isLoading = false;
    }); 

  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    this.uploadService
    .fullUploadProcess(imageData,this.form)
    .then((val) =>{
      const name = val.split('_')[0];
      this.actualImage = name;
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

      this.usersService.onUpdateUserProfile( this.form.get('displayName').value , this.actualImage )
      .then( (res) => {
        console.log('Profile updated! :' + res); 
        const info = this.form.value;
        console.log('img :',this.actualImage);
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
