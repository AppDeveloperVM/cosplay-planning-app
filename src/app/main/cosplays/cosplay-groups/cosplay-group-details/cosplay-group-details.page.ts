import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, ToastController, AlertController } from '@ionic/angular';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cosplay } from '../../cosplay.model';
import { Subscription } from 'rxjs';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { PlaceDataService } from 'src/app/services/place-data.service';

@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit, OnDestroy {
  cosplayGroup: CosplayGroup;
  newCosplayGroup: CosplayGroup;
  cosplay: Cosplay;
  placesData = [];
  cosplayGroupId: string;
  isLoading = false;
  private cosplayGroupSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private placeDataService: PlaceDataService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    //this.fetchPlacesData();

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/cosplay-groups');
        console.log('cant get cosplaygroupId');
        return;
      }
      this.isLoading = true;
      this.cosplayGroupId = paramMap.get('cosplayGroupId');
      console.log('id:' + paramMap.get('cosplayGroupId'));
      console.log(
        this.cosplayGroupService.getCosplayGroup(paramMap.get('cosplayGroupId'))
      );

      this.cosplayGroupSub = this.cosplayGroupService
      .getCosplayGroup(paramMap.get('cosplayGroupId'))
      .subscribe(cosplayGroup => {
        this.cosplayGroup = cosplayGroup;
        this.isLoading = false;
      }, error => {
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load cosplay. Try again later.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              console.log(error);
              this.router.navigate(['/main/tabs/cosplays/cosplay-groups']);
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

  getMarkers(){
    for (let marker in this.cosplayGroup.location) {
      this.placesData.push(marker);
    }
  }


  onRequestCosplayGroup() {
    
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
      center: { lat: this.cosplayGroup.location.lat, lng: this.cosplayGroup.location.lng },
      markers: this.placesData , // array of markers
      selectable: false,
      closeButtonText: 'close',
      title: this.cosplayGroup.title
    } }).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

}
