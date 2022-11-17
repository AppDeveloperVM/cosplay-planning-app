import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { MapModalComponent } from '../../../../shared/map-modal/map-modal.component';

import { MapModalLeafletComponent } from '../../../../shared/map-modal-leaflet/map-modal-leaflet.component';

import { NgForm } from '@angular/forms';
import { PlaceDataService } from '../../../../services/place-data.service';
import { Coordinates } from '../../../../models/location.model';
import { UploadImageService } from '../../../../services/upload-img.service';

interface PlaceLocation extends Coordinates {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  address: string;  
  staticMapImageUrl: string;
}

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.page.html',
  styleUrls: ['./planning-detail.page.scss'],
})
export class PlanningDetailPage implements OnInit, OnDestroy {
  planning: any;
  newPlanning: Planning;
  placesData = [];
  planningId: string;
  imageUrl : string = '';
  imageReady = false;

  isLoading = false;
  private planningSub: Subscription;
  isMobile = false;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private planningService: PlanningService,
    private placeDataService: PlaceDataService,
    private imgService : UploadImageService,
    private platform: Platform
  ) {

    
    //console.log("location: "+this.planning.location);
   }

  ngOnInit() {
    if(this.platform.is("mobile")){
      this.isMobile = true;
    }

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('planningId')) {
        this.navCtrl.navigateBack('/main/tabs/planning');
        return;
      }
      this.isLoading = true;
        console.log('Searched for planningId: '+ paramMap.get('planningId'));
        //Getting the planning by Id
        this.planning = this.planningService
        .getPlanningById(paramMap.get('planningId'))
        .subscribe(planning => {
          this.planning = planning;

          if(planning!= null){
            this.placesData = this.planning.places != undefined ? this.planning.places : [] ;
            
            if(this.planning.imageUrl != null) {
              this.getImageByFbUrl(this.planning.imageUrl,2)
              .then((val)=>{
                this.imageUrl = val;
                this.imageReady = true;
              })
              .catch((err) => {
                console.log(err);
                this.imageUrl = null;
                this.imageReady = true;
              })
            } else {
              this.imageUrl = null;
              this.imageReady = true;
            } 

            
          } else {
          console.log("Error loading item - not found");
          this.router.navigate(['/main/tabs/planning']);
          }
          
          this.isLoading = false;
        },error => {
          //Show alert with defined error message
          this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load planning. Try again later. Error:'+error,
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/main/tabs/planning']);
              }
            }]
          }).then(alertEl => {
            alertEl.present();
          });
        });

    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  onGoToEdit(planningId: string) {
    this.router.navigate(['main/tabs/planning/edit/' + planningId]);
  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  onShowFullMap() {
    console.log(this.placesData[0]);
    this.modalCtrl.create({component: MapModalLeafletComponent, 
      componentProps: {
        item: this.planning,
        itemType: 'planning',
        center: { lat: this.planning.location.lat, lng: this.planning.location.lng }, //bcn
        //{ lat: this.cosplayGroup.location.lat, lng: this.cosplayGroup.location.lng },
        markers: this.placesData , // array of markers
        selectable: false,
        multiple: true,
        closeButtonText: 'cerrar',
      } }).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.planningSub) {
      this.planningSub.unsubscribe();
    }
  }


}
