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
import { UploadImageService } from 'src/app/services/upload-img.service';


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
  imageUrl : string = '';

  isMobile: boolean;

  //Collections
  cosGroupMembers$: Observable<CosGroupMember[]>;
  private cosgroupsmembersCollection: AngularFirestoreCollection<CosGroupMember>;

  arreglo1 = [10, 20, 30, 40, 50];
  cosplayGroup: any;

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
    private imgService : UploadImageService,
    private placeDataService: PlaceDataService,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {

    
  }

  ngOnInit() {
    this.subscription = this.dataService.editMode$.subscribe(r => this.editMode = r)

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplay-groups');
        return;
      }

      this.isLoading = true;
      console.log('Searched for cosplayId: '+ paramMap.get('cosplayId'));
      //Getting the cosplayGroup by Id
      this.cosplayGroupSub = this.cosplayGroupService
        .getCosGroupById(paramMap.get('cosplayGroupId'))
        .subscribe(cosGroup => {
          this.cosplayGroup = cosGroup;
          
          if(cosGroup!= null){

            this.getImageByFbUrl(this.cosplayGroup.imageUrl,2).then((val)=>{
              this.imageUrl = val; 
            })

            this.placesData.push(this.cosplayGroup.location);
            console.log("location: "+ this.cosplayGroup.location);
            
            this.cosgroupsmembersCollection = this.afs.collection<CosGroupMember>(`cosplay-groups/${this.cosplayGroup.id}/cosMembers`);
            this.getcosGroupMembers();
            

          }
          this.isLoading = false;
        }, error => {
          //Show alert with defined error message
          this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load cosplay. Try again later. Error:'+error,
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
              }
            }]
          }).then(alertEl => {
            alertEl.present();
          });
          
        });

    });
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  getMarkers(){
    for (let marker in this.cosplayGroup.location) {
      this.placesData.push(marker);
    }
  }

  onGoToEdit(cosGroupId : string){
    this.router.navigate(['main/tabs/cosplay-groups/edit/' + cosGroupId]);
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
    this.cosGroupMembers$ = ref.snapshotChanges().pipe(
        map( actions => actions.map(
            a => {
              const data = a.payload.doc.data() as CosGroupMember;
              const memberId = a.payload.doc.id;
              return { memberId, ...data };
            }
           )
        )
    )
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
        ember: this.cosGroupMembers$,
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
