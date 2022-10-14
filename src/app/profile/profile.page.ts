import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Screenshot } from 'capacitor-screenshot';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  instagram_url = '';
  instagram_user = 'SpaceRonin_v';
  instagram_name = 'SpaceRonin';

  twitter_url = '';
  twitter_user = 'SpaceRonin_v';
  twitter_name = 'SpaceRonin';

  constructor(private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.instagram_url = `https://www.instagram.com/${this.instagram_user}/?hl=es`;
    this.twitter_url = `https://www.twitter.com/${this.twitter_user}/?hl=es`;
  }

  async Share(){
    const native = Capacitor.isNativePlatform();
    if(native){
      /* Screenshot.take().then((ret: { base64: string }) => {
        console.log(ret.base64); // or `data:image/png;base64,${ret.base64}`
      }); */
      
    }
    await this.socialSharing.shareViaTwitter(
      'See cool stuff',
      'Really awesome thing you need to see right meow',
      'http://ionicframework.com/'
    ).then(response => {
      console.log("shared!");
    }).catch(e => {
      console.log("error sharing");
    });
    
    
  }

}
