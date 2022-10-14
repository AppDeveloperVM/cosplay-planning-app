import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Screenshot } from 'capacitor-screenshot';


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

  constructor() { }

  ngOnInit() {
    this.instagram_url = `https://www.instagram.com/${this.instagram_user}/?hl=es`;
    this.twitter_url = `https://www.twitter.com/${this.twitter_user}/?hl=es`;
  }

  Share(){
    const native = Capacitor.isNativePlatform();
    if(native){
      Screenshot.take().then((ret: { base64: string }) => {
        console.log(ret.base64); // or `data:image/png;base64,${ret.base64}`
    });
    }
    
  }

}
