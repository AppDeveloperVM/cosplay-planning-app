import { Component, OnInit } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { Route } from '@angular/compiler/src/core';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.page.html',
  styleUrls: ['./planning-detail.page.scss'],
})
export class PlanningDetailPage implements OnInit {
  planning: Planning;
  planningId: string;
  private planningSub: Subscription;
  newPlanning: Planning;
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('planningId')) {
        this.navCtrl.navigateBack('/main/planning');
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
              this.router.navigate(['/main/planning']);
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
      selectable: false,
      closeButtonText: 'close',
      title: this.planning.title
    } }).then(modalEl => {
      modalEl.present();
    });
  }


}
