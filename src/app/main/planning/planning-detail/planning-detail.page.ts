import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

import { MapModalLeafletComponent } from 'src/app/shared/map-modal-leaflet/map-modal-leaflet.component';

import { NgForm } from '@angular/forms';
import { PlaceDataService } from 'src/app/services/place-data.service';

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

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private planningService: PlanningService,
    private placeDataService: PlaceDataService
  ) {

   }

  ngOnInit() {

      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('planningId')) {
          this.navCtrl.navigateBack('/planning');
          console.log('cant get planningId');
          return;
        }
  
        this.isLoading = true;

        this.planningId = paramMap.get('planningId');
        console.log('id:' + paramMap.get('planningId'));
        console.log(
          this.planningService.getPlanning(paramMap.get('planningId'))
        );
  
        this.planningSub = this.planningService
        .getPlanning(paramMap.get('planningId'))
        .subscribe(planning => {
          this.planning = planning;
          console.log(this.planning);

          const planningProps = Object.entries(planning.places);
          console.log("Get marker!: "+ planningProps);

          var MarkerObject = [];
          Object.entries(planning).forEach(([key,value]) => {
            
            if(key == 'places'){
              console.log("Get marker!: "+ planning[key]);
              MarkerObject.push(planning[key]);
            }else if(key == 'address'){
              console.log('name: '+planning[key]);
              MarkerObject['name'] = planning[key];
            }
    
          });

          this.placesData = MarkerObject;
          console.log("places data: "+ Object.keys(this.placesData[0]) );
  
          this.isLoading = false;

        }, error => {

        });

      });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
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
