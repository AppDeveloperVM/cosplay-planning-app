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
  newPlanning: Planning;
  placesData = [];
  planningId: string;
  isLoading = false;
  private planningSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private planningService: PlanningService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private placeDataService: PlaceDataService
  ) {

   }

  ngOnInit() {
    //this.fetchPlacesData(); //add places from json

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

  fetchPlacesData() { // fetch places from json
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
      center: { lat: this.planning.places['lat'], lng: this.planning.places['lng'] },
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
