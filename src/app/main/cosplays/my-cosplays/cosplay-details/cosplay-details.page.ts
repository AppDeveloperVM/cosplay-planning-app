import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Subscription } from 'rxjs';
import { CosElementModalComponent } from './cos-element-modal/cos-element-modal.component';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-cosplay-details',
  templateUrl: './cosplay-details.page.html',
  styleUrls: ['./cosplay-details.page.scss'],
})
export class CosplayDetailsPage implements OnInit, OnDestroy {
  //rootPage: any = TabsPage;

  cosplay: Cosplay;
  cosplayId: string;
  isLoading = false;
  private cosplaySub: Subscription;
  default: string = "elements"; // default segment

  //array para los tipos de segment y sus datos
  tasks_segment: string = "tasks"; 
  tasks: any = [{name : "Coser traje de tienda china",image: "photo",type:"buy"},{name : "Imprimar goma Eva",type:"make"},{name : "Planear piezas collar",type:"make"}];
  cosElements: any = [{name : "Hat",image: "photo",type:"buy",store:"amazon.es",store_url:"amazon.es"},{name : "Suit",type:"buy",store:"la tienda de la pepa"},{name : "Shoes",type:"make"}];
  toBuy: boolean;

  navigationExtras: NavigationExtras = {
    state : {
      cosplay: null
    }
  }

  // seria necesario ordenar los arrays por 'a comprar' y 'a hacer'
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private cosplaysService: CosplaysService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/cosplays/my-cosplays']); }
    this.cosplay = navigation?.extras?.state.value;
  }

  ngOnInit() {
      //check buy lists for header
      //this.toBuyList();
  }

  onGoToEdit(item: any) {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/my-cosplays/edit'], this.navigationExtras );
    return false;
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
    },


    }
    ).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
