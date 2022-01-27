import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PlanningService } from '../../../services/planning.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

import { MapModalLeafletComponent } from 'src/app/shared/map-modal-leaflet/map-modal-leaflet.component';

import { NgForm } from '@angular/forms';
import { PlaceDataService } from 'src/app/services/place-data.service';
import { Coordinates } from '../../../models/location.model';

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
  planning: Planning;
  newPlanning: Planning;
  placesData = [];
  planningId: string;
  isLoading = false;
  private planningSub: Subscription;
  isMobile = false;

  navigationExtras: NavigationExtras = {
    state : {
      planning: null
    }
  }

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private planningService: PlanningService,
    private placeDataService: PlaceDataService,
    private platform: Platform
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/planning']); }
    this.planning = navigation?.extras?.state.value;

    //this.placesData.push(this.planning.location);
    //console.log("location: "+this.planning.location);
   }

  ngOnInit() {
    if(this.platform.is("mobile")){
      this.isMobile = true;
    }

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  onGoToEdit(item: any) {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/planning/edit'], this.navigationExtras );
    //main/tabs/cosplays/my-cosplays/cosplay-details
    return false;
  }

  onSubmit(form: NgForm) {
  }

  onShowFullMap() {
    console.log(this.placesData[0]);
    this.modalCtrl.create({component: MapModalLeafletComponent, 
      componentProps: {
        center: [this.placesData[0].lat, this.placesData[0].lng], //bcn
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
