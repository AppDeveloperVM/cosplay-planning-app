import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../cosplays.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cosplay-details',
  templateUrl: './cosplay-details.page.html',
  styleUrls: ['./cosplay-details.page.scss'],
})
export class CosplayDetailsPage implements OnInit, OnDestroy {
  cosplay: Cosplay;
  private cosplaySub: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplaysService: CosplaysService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
        return;
      }
      this.cosplaySub = this.cosplaysService.getCosplay(paramMap.get('cosplayId')).subscribe(cosplay => {
        this.cosplay = cosplay;
      })
      // load the cosplay
    });
  }

  onEditCosplay() {
    // this.router.navigateByUrl('/main/tabs/cosplays/my-cosplays');
    this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
  }

  ngOnDestroy() {
    if (this.cosplaySub){
      this.cosplaySub.unsubscribe();
    }
  }

}
