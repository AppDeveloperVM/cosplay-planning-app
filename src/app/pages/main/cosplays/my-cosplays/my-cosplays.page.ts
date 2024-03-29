import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Cosplay } from '../../../../models/cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from '../../../../services/auth.service';
import { isPlatform, PopoverController } from '@ionic/angular';
import { PopinfoComponent } from '../../../../components/popinfo/popinfo.component';
import { Data, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { NoticesService } from '../../../../services/notices.service';
import { DataService } from '../../../../services/data.service';
import { threadId } from 'worker_threads';
import { SettingsService } from '../../../../services/settings.service';

import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
 
@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit, OnDestroy {
  cosplays$ = this.cosplaysService.cosplaysObsv;
  
  loadedCosplays: Cosplay[];
  isLoading = false;
  listedLoadedCosplays: Cosplay[];
  relevantCosplays: Cosplay[];
  private cosplaysSub: Subscription;
  private filter = 'all';

  constructor(
    private cosplaysService: CosplaysService,
    private noticesService: NoticesService,
    private authService: AuthService,
    private dataService : DataService,
    public _settings: SettingsService,
    private popoverCtrl: PopoverController,
    private routermodule: RouterModule,
    private http: HttpClient
  ) {
    this.initializeAdds();
    this.showBanner();
   }

  ngOnInit() {
    this.isLoading = true;
    this.cosplays$.subscribe(cos => {
      console.log('loaded coss');
      
      this.loadedCosplays = cos
      this.isLoading = false;
    });
    
    /*
    this.cosplaysSub = this.cosplaysService.cosplays.subscribe(cosplays => {
      this.loadedCosplays = cosplays;
      this.listedLoadedCosplays = this.loadedCosplays;
      this.onFilterUpdate(this.filter);
    });
    */
  }

  async initializeAdds(){
    const { status } = await AdMob.trackingAuthorizationStatus();
    console.log(status);
    if(status === 'notDetermined') {
      console.log('Display info before ads loads first');
    }

    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOURTESTEDEVICE'],
      initializeForTesting: true
    })
  }

  async showBanner(){
    const adId = isPlatform('ios') ? 'ios-ad' : 'android-ad-unit';
    //'ca-app-pub-9910402320172254/4923025825'

    const options : BannerAdOptions = {
      adId, 
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
      //set this to true to non-pernsonalized Ads
      //npa: true
    }

    await AdMob.showBanner(options);
  }

  onFilterUpdate(filter: string) {
    if (filter === 'all') {
      this.relevantCosplays = this.loadedCosplays; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      /*this.relevantCosplays = this.loadedCosplays.filter(
        cosplay => cosplay.status !== true // checking status
      );
      */
    }
    this.listedLoadedCosplays = this.relevantCosplays;
  }

  async addData(){
    //this.dataService.addData('user',`Vic ${Math.floor(Math.random() * 100)}`);
    this.dataService.getData().subscribe(res => {
      console.log(res);
      
    });
  }

  ngOnDestroy() {
    if (this.cosplaysSub) {
      this.cosplaysSub.unsubscribe();
    }
  }


}
