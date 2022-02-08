import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CosplaysService } from 'src/app/services/cosplays.service';
import { Cosplay } from '../../cosplay.model';

@Component({
  selector: 'app-cosplay-item',
  templateUrl: './cosplay-item.component.html',
  styleUrls: ['./cosplay-item.component.scss'],
})
export class CosplayItemComponent implements OnInit {
  @Input() cosplay: Cosplay;
  public imgSrc: any;
  editMode : Boolean = false;

  navigationExtras: NavigationExtras = {
    state : {
      cosplay: null
    }
  }

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private cosplaysService: CosplaysService,
  ) { }

  ngOnInit() {
    console.log(this.cosplay);
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/my-cosplays/cosplay-details'], this.navigationExtras );
  }

  

  async onDeleteCosplay(cosplayId: string): Promise<void> {

    await this.loadingCtrl
    .create({
      message: 'Deleting Cosplay...'
    })
    .then(loadingEl => {
      loadingEl.present();
        try {
          this.cosplaysService.onDeleteCosplay(cosplayId);
        }catch (err) {
          console.log(err);
        }

        setTimeout(() => {
          loadingEl.dismiss();
        }, 500);

    });
  }

}
