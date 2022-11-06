import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UploadImageService } from '../../services/upload-img.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData = null;
  isLoading = true;
  imageUrl = null;
  imageReady = false;

  instagram_url = '';
  instagram_user = 'SpaceRonin_v';
  instagram_name = 'SpaceRonin';

  twitter_url = '';
  twitter_user = 'SpaceRonin_v';
  twitter_name = 'SpaceRonin';

  constructor( private authFire : AngularFireAuth, private imgService : UploadImageService ) {
    this.authFire.authState.subscribe((user) => {  
      this.isLoading = false;

      this.userData = user;
      if( user.displayName == null ){
        this.userData.displayName = user.email;
      }

      if(user.photoURL != null) {
        this.getImageByFbUrl(user.photoURL,2).then((val)=>{
          this.imageUrl = val; 
          this.imageReady = true;
        })
      } else {
        this.imageUrl = null;
        this.imageReady = true;
      }  

      console.log(user);
    });
  }

  ngOnInit() {

    

    this.instagram_url = `https://www.instagram.com/${this.instagram_user}/?hl=es`;
    this.twitter_url = `https://www.twitter.com/${this.twitter_user}/?hl=es`;
  }


  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  async Share(){
    const native = Capacitor.isNativePlatform();
    if(native){
      /* Screenshot.take().then((ret: { base64: string }) => {
        console.log(ret.base64); // or `data:image/png;base64,${ret.base64}`
      }); */
    }

    const logDeviceInfo = async () => {
      const lang = await Device.getInfo();
      console.log('language : '+ lang);
    };

    await Share.share({
      title: 'Comparte tu perfil',
      text: 'Conecta conmigo en la app de CosPlanning',
      url: `https://www.instagram.com/${this.instagram_user}/?hl=es`,
      dialogTitle: 'Share with buddies',
    });
    
    
  }

}
