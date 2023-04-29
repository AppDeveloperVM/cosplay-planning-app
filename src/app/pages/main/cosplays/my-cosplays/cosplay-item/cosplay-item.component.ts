import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Observable, Subscription } from 'rxjs';
import { CosplaysService } from '../../../../../services/cosplays.service';
import { DataService } from '../../../../../services/data.service';
import { StorageService } from '../../../../../services/storage.service';
import { UploadImageService } from '../../../../../services/upload-img.service';
import { Cosplay } from '../../../../../models/cosplay.model';
import{ GlobalConstants } from './../../../../../common/global-constants';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Attributes } from 'ng-lazyload-image';





@Component({
  selector: 'app-cosplay-item',
  templateUrl: './cosplay-item.component.html',
  styleUrls: ['./cosplay-item.component.scss'],
})
export class CosplayItemComponent implements OnInit {
  @Input() cosplay: Cosplay;
  public imgSrc: any;
  editMode$ = this.dataService.editMode$
  subscription: Subscription;
  imageUrl: String;
  imageName : String;
  imgObsv : Observable<any>;
  isLoading : boolean = true;
  defaultImg = GlobalConstants.defaultImgSRC;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private cosplaysService: CosplaysService,
    private dataService: DataService,
    private uploadImgService : UploadImageService,
    private storageService : StorageService,
    private http: HttpClient
  ) { }  

  ngOnInit() {
    console.log('nginit');
    
    this.imageName = this.cosplay.imageUrl;

    if(this.imageName == null){
      this.imageUrl = null;
      this.isLoading = false;
      return false;
    }

    var imgSrc = null;

      this.uploadImgService.getStorageImgUrl(this.imageName, 0)
      .then((val)=>{
        imgSrc = val;
      }).finally(() => {
        console.log('image loaded');
        
        this.imageUrl = imgSrc;
        this.loadImage(imgSrc);
        this.isLoading = false;
      });
 
  }

  async loadImage({ imagePath }: Attributes) {
    return [imagePath];
  }

  /* loadImage(imgSource) {
    this.imgObsv = from(fetch(imgSource)).pipe(map(data => {
      return data.url;
      
    }))
    this.imgObsv.subscribe(res => {
      console.log(res);
      
    })
  } */

  onGoToSee(cosplayId: string): void {
    this.router.navigate(['main/tabs/cosplays/my-cosplays/details/'+cosplayId]);
  }  

  async onDeleteCosplay(cosplayId: string): Promise<void> {

    this.storageService.deleteThumbnail(this.imageName)
    .then( async (res) => {
      //Thumbnail deleted .. continue

      await this.loadingCtrl
      .create({
        message: 'Deleting Cosplay...'
      })
      .then(loadingEl => {
        loadingEl.present();
          try {
            this.cosplaysService.onDeleteCosplay(cosplayId);
          }catch (err) {
            console.log('Error deleting cosplay: ' + err);
          }

          setTimeout(() => {
            loadingEl.dismiss();
          }, 500);

      });

    })
    .catch( (err) => {
      console.log('Error deleting cos Thumbnail :' + err);
      
    });

    
  }

 /*  onImgLazyLoaded(event: StateChange) {
    switch (event.reason) {
      case 'setup':
        // The lib has been instantiated but we have not done anything yet.
        break;
      case 'observer-emit':
        // The image observer (intersection/scroll/custom observer) has emit a value so we
        // should check if the image is in the viewport.
        // `event.data` is the event in this case.
        break;
      case 'start-loading':
        // The image is in the viewport so the image will start loading
        break;
      case 'mount-image':
        // The image has been loaded successfully so lets put it into the DOM
        break;
      case 'loading-succeeded':
        // The image has successfully been loaded and placed into the DOM
        break;
      case 'loading-failed':
        // The image could not be loaded for some reason.
        // `event.data` is the error in this case
        break;
      case 'finally':
        // The last event before cleaning up
        break;
    }

  } */

}
