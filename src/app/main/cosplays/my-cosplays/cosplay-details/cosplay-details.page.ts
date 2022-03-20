import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../../../models/cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Subscription } from 'rxjs';
import { CosElementModalComponent } from './cos-element-modal/cos-element-modal.component';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UploadImageService } from 'src/app/services/upload-img.service';

@Component({
  selector: 'app-cosplay-details',
  templateUrl: './cosplay-details.page.html',
  styleUrls: ['./cosplay-details.page.scss'],
})
export class CosplayDetailsPage implements OnInit, OnDestroy {
  //rootPage: any = TabsPage;

  cosplay: any;
  cosplayId: string;
  isLoading = false;
  imageReady = false;
  private cosplaySub: Subscription;
  imageUrl : string = '';
  default: string = "elements"; // default segment

  //array para los tipos de segment y sus datos
  tasks_segment: string = "tasks"; 
  tasks: any = [{name : "Coser traje de tienda china",image: "photo",type:"buy"},{name : "Imprimar goma Eva",type:"make"},{name : "Planear piezas collar",type:"make"}];
  cosElements: any = [{name : "Hat",image: "photo",type:"buy",store:"amazon.es",store_url:"amazon.es"},{name : "Suit",type:"buy",store:"la tienda de la pepa"},{name : "Shoes",type:"make"}];
  toBuy: boolean;


  // seria necesario ordenar los arrays por 'a comprar' y 'a hacer'
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private cosplaysService: CosplaysService,
    private imgService : UploadImageService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
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

  OpenItemDetails(title : String, store: String, status: boolean){
    this.modalCtrl.create({
    component: CosElementModalComponent, 
    cssClass: 'custom-modal',
    componentProps: {
      closeButtonText: 'X',
      title,
      store,
      status
    }}).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
