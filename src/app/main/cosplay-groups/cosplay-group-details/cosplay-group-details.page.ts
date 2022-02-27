import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../../../services/cosplay-group.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cosplay } from '../../../models/cosplay.model';
import { Observable, Subscription } from 'rxjs';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { PlaceDataService } from 'src/app/services/place-data.service';
import { MapModalLeafletComponent } from 'src/app/shared/map-modal-leaflet/map-modal-leaflet.component';

import { CharacterMember } from 'src/app/models/characterMember.model';
import { CosgroupEditModalComponent } from 'src/app/shared/cosgroup-edit-modal/cosgroup-edit-modal.component';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';
import { delay, map } from 'rxjs/operators';
import { CosGroupMember } from 'src/app/models/cosGroupMember.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit, OnDestroy {
  //cosplayGroup: CosplayGroup;
  newCosplayGroup: CosplayGroup;
  cosplay: Cosplay;
  placesData = [];
  cosplayGroupId: string;
  isLoading = false;
  private cosplayGroupSub: Subscription;
  cosplayGroupMembers:any[]=[];

  isMobile: boolean;

  //Collections
  cosGroupMembers: Observable<CosGroupMember[]>;
  private cosgroupsmembersCollection: AngularFirestoreCollection<CosGroupMember>;
  cosGroupMembers$;

  arreglo1 = [10, 20, 30, 40, 50];
  cosplayGroup = null;

  navigationExtras: NavigationExtras = {
    state : {
      cosplaygroup: null
    }
  }

  editMode: boolean;
  subscription: Subscription;
  dataReturned;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private cosplayGroupService: CosplayGroupService,
    private dataService: DataService,
    private placeDataService: PlaceDataService,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/cosplay-groups']); }
    this.cosplayGroup = navigation?.extras?.state.value;

    this.placesData.push(this.cosplayGroup.location);
    console.log("location: "+this.cosplayGroup.location);
    
    this.cosgroupsmembersCollection = afs.collection<CosGroupMember>(`cosplay-groups/${this.cosplayGroup.id}/cosMembers`);
    this.getcosGroupMembers();
  }

  ngOnInit() {
    this.subscription = this.dataService.editMode$.subscribe(r => this.editMode = r)
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  getMarkers(){
    for (let marker in this.cosplayGroup.location) {
      this.placesData.push(marker);
    }
  }

  onGoToEdit(item:any){
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplay-groups/edit'], this.navigationExtras );
    return false;
  }

  onGoToRequestForm(item: any): void {
    //this.navigationExtras.state.value = item;
   
    this.modalCtrl
    .create(
      {
        component: CosplayGroupSendRequestComponent,
          componentProps: {
            selectedCosplayGroup: this.cosplayGroup,
          }
      }
    ).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role === 'confirm') {

        this.loadingCtrl.create({message: resultData.data.message })
        .then(
          loadingEl => {
            loadingEl.present();
            const data = resultData.data; // get possible extra data from here

            setTimeout(() => {
              loadingEl.dismiss();
            }, 500);
          }
        );
      }

    });
  }

  private getcosGroupMembers(): void {
    const ref = this.cosgroupsmembersCollection;
    this.cosGroupMembers = ref.snapshotChanges().pipe(
        map( actions => actions.map(
            a => {
              const data = a.payload.doc.data() as CosGroupMember;
              const memberId = a.payload.doc.id;
              return { memberId, ...data };
            }
           )
        )
    )
    this.cosGroupMembers$ = this.cosGroupMembers;
  }

  async enableEdit(): Promise<void>{
    this.dataService.modeChanged(!this.editMode);
    console.log("edit mode:"+this.editMode);
  }

  onEditCosGroupMembers() {
    //this.navigationExtras.state.value = this.cosGroupMembers;
    this.modalCtrl.create({
      component: CosgroupEditModalComponent, 
      componentProps: {
        ember: this.cosGroupMembers,
        closeButtonText: 'close',
        title: ' Cosplay Group Members'
    } }).then(modalEl => {
      modalEl.present();
    });
  }

  async onDeleteMember(cosGroupMemberId: string): Promise<void> {

    await this.loadingCtrl
    .create({
      message: 'Deleting Group Member...'
    })
    .then(loadingEl => {
      loadingEl.present();
        try {
          this.cosplayGroupService.onDeleteCosGroupMember(this.cosplayGroup.id,cosGroupMemberId);
        }catch (err) {
          console.log(err);
        }

        setTimeout(() => {
          loadingEl.dismiss();
        }, 500);

      //this.router.navigate(['main/tabs/cosplay-groups']);
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
    this.modalCtrl.create({component: MapModalLeafletComponent, componentProps: {
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
