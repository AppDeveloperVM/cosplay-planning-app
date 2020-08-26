import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { NgForm } from '@angular/forms';
import { PlaceDataService } from 'src/app/services/place-data.service';

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.page.html',
  styleUrls: ['./planning-detail.page.scss'],
})
export class PlanningDetailPage implements OnInit, OnDestroy {
  planning: Planning;
  planningId: string;
  private planningSub: Subscription;
  newPlanning: Planning;
  isLoading = false;
  placesData = [];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private placeDataService: PlaceDataService
  ) {
    fetch('./assets/data/places_1.json').then(res => res.json()) // json file depends on planning id
      .then(data => {
        this.placesData = data.places;
        this.placeDataService.setPlaces(this.placesData);
      });
   }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('planningId')) {
        this.navCtrl.navigateBack('/planning');
        return;
      }
      this.isLoading = true;
      this.planningId = paramMap.get('planningId');
      this.planningSub = this.planningService
      .getPlanning(paramMap.get('planningId'))
      .subscribe(planning => {
        this.planning = planning;
        this.isLoading = false;
      }, error => {
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load planning. Try again later.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/planning']);
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      }
      );

      console.log('Planning id: ' + this.planning.id);
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;
    // this.newCosplay = this.cosplayService.setCosplayRequest();

    console.log(characterName);
  }

  onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: { lat: this.planning.location.lat, lng: this.planning.location.lng },
      markers: this.placesData , // array of markers
      selectable: false,
      closeButtonText: 'close',
      title: this.planning.title
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
