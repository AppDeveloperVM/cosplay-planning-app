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
  paramMapId: string;
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

   }

  ngOnInit() {
    // this.fetchPlacesData();

    this.route.paramMap.subscribe(paramMap => {
      this.planningId = paramMap.get('planningId');
      if (!this.planningId === null) {
        this.navCtrl.navigateBack('/main/tabs/planning');
        return;
      }

      this.isLoading = true;
      this.planningSub = this.planningService
      .getPlanning(this.planningId)
      .subscribe(planning => {
        this.planning = planning;
        console.log('Planning id: ' + this.planningId);
        console.log('Planning: ' , planning);
        this.isLoading = false;
      }, error => {
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load planning. Try again later.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              console.log(error);
              this.router.navigate(['/main/tabs/planning']);
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      }
      );

    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  fetchPlacesData() {
    fetch('../../assets/data/places_1.json').then(res => res.json()) // json file depends on planning id
      .then(data => {
        this.placesData = data.places;
        this.placeDataService.setPlaces(this.placesData);
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
      selectable: true,
      multiple: true,
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
