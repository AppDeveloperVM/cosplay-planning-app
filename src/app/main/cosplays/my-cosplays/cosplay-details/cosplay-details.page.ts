import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Cosplay } from '../../../../models/cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Subscription } from 'rxjs';
import { CosElementDetailsModalComponent } from './cos-element-modal-details/cos-element-details-modal.component';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { CosElementTobuyModalComponent } from './cos-element-tobuy-modal/cos-element-tobuy-modal.component';
import { CosElementTomakeModalComponent } from './cos-element-tomake-modal/cos-element-tomake-modal.component';
import { CosTaskModalComponent } from './cos-task-modal/cos-task-modal.component';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { CosElementToBuy } from 'src/app/models/cosElementToBuy.model';
import { CosElementToDo } from 'src/app/models/cosElementToDo.model';
import { CosTask } from 'src/app/models/cosTask.model';

@Component({
  selector: 'app-cosplay-details',
  templateUrl: './cosplay-details.page.html',
  styleUrls: ['./cosplay-details.page.scss'],
})
export class CosplayDetailsPage implements OnInit, OnDestroy {
  //rootPage: any = TabsPage;
  cosElementsToBuy$ = this.cosDevelopService.elementsToBuyObsv;
  cosElementsToMake$ = this.cosDevelopService.elementsToDoObsv;
  cosTasks$ = this.cosDevelopService.tasksObsv;

  cosplay: any;
  cosplayId: string;
  isLoading = false;
  imageReady = false;
  private cosplaySub: Subscription;
  imageUrl : string = '';
  default: string = "elements"; // default segment
  
  //Collections
  private cosplaysCollection: AngularFirestoreCollection<Cosplay>;
  private elToBuyCollection: AngularFirestoreCollection<CosElementToBuy>;
  private elToDoCollection: AngularFirestoreCollection<CosElementToDo>;
  private tasksCollection: AngularFirestoreCollection<CosTask>;


  //array para los tipos de segment y sus datos
  tasks_segment: string = "tasks"; 
  tasks: any = [
    { name : "Coser traje de tienda china", image: "photo", type:"task"},
    { name : "Imprimar goma Eva", type:"task"},
    { name : "Planear piezas collar", type:"task"}
  ];
  cosElementsToBuy: any = [
    { id: '12313', name : "Hat", image: "photo", type: 'toBuy', store:"amazon.es", store_url:"amazon.es", completed: false, important: false},
    { id: '423432', name : "Suit", type: 'toBuy', store:"la tienda de la pepa", completed: true, important: true},
  ];
  cosElementsToDo: any = [
    { id: '25252', name : "Shoes", type:'toMake', time: "5:00", percentComplete: "72"}
  ];
  toBuy: boolean;


  // seria necesario ordenar los arrays por 'a comprar' y 'a hacer'
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private cosplaysService: CosplaysService,
    private imgService : UploadImageService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private readonly afs: AngularFirestore,
    private cosDevelopService: CosplayDevelopService
  ) {

  }

  ngOnInit() {
      let cosplayDetailed;
      //check buy lists for header
      //this.toBuyList();
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('cosplayId')) {
          //this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
          return;
        }

        this.isLoading = true;
        console.log('Searched for cosplayId: '+ paramMap.get('cosplayId'));
        //Getting the cosplay by Id
        this.cosplaySub = this.cosplaysService
        .getCosplayById(paramMap.get('cosplayId'))
        .subscribe(cosplay => {
          this.cosplay = cosplay;
          if(cosplay!= null){
            this.getImageByFbUrl(this.cosplay.imageUrl,2).then((val)=>{
              this.imageUrl = val;
              this.imageReady = true;
            })
          }

          if(cosplay!= null){
            this.cosDevelopService.cosplay = this.cosplay;
            this.cosDevelopService.elToBuyCollection = this.afs.collection<CosElementToBuy>(`cosplays/${this.cosplay.id}/cosElementsToBuy`);
            this.cosDevelopService.elToDoCollection = this.afs.collection<CosElementToDo>(`cosplays/${this.cosplay.id}/cosElementsToDo`);
            this.cosDevelopService.tasksCollection = this.afs.collection<CosTask>(`cosplays/${this.cosplay.id}/cosTasks`);
            this.cosDevelopService.getElementsToBuy();
            this.cosDevelopService.getElementsToDo();
            this.cosDevelopService.getTasks();
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

  

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  onGoToEdit(cosplayId: string) {
    console.log('Goto edit cosplayId:'+cosplayId);
    this.router.navigate(['main/tabs/cosplays/my-cosplays/edit/'+cosplayId]);
  }

  toBuyList() {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].type == "buy"){
        this.toBuy = true;
      }
    }
  }

  OpenItemDetails(id : String, type){
    let comp;
    if(type == 'toBuy'){
      comp = CosElementTobuyModalComponent
    } else if(type == 'toMake'){
      comp = CosElementTomakeModalComponent
    } else if(type == 'task'){
      comp = CosTaskModalComponent
    }
    
    this.modalCtrl.create({
    component: comp, 
    cssClass: 'custom-modal',
    componentProps: {
      closeButtonText: 'X',
      title: 'title',
      selectedCosplay: this.cosplay
    }}).then(modalEl => {
      modalEl.present();
    });
  }

  async onDeleteElement(elementId: string): Promise<void> {

    await this.loadingCtrl
    .create({
      message: 'Deleting Element...'
    })
    .then(loadingEl => {
      loadingEl.present();
        try {
          this.cosDevelopService.onDeleteElementToBuy(this.cosplay.id,elementId);
        }catch (err) {
          console.log(err);
        }

        setTimeout(() => {
          loadingEl.dismiss();
        }, 500);

    });
  }

  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
