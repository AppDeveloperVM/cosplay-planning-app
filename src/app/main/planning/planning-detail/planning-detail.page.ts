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
      this.isLoading = false;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  onSubmit(form: NgForm) {
  }

  onShowFullMap() {
    this.modalCtrl.create({component: MapModalLeafletComponent, 
      componentProps: {
        markers: this.placesData , // array of markers
        selectable: true,
        multiple: true,
        closeButtonText: 'close',
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
