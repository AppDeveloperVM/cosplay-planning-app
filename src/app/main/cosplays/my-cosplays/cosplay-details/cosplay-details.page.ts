import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../cosplays.service';

@Component({
  selector: 'app-cosplay-details',
  templateUrl: './cosplay-details.page.html',
  styleUrls: ['./cosplay-details.page.scss'],
})
export class CosplayDetailsPage implements OnInit {
  cosplay: Cosplay;

  constructor(private router: Router, private navCtrl: NavController, private route: ActivatedRoute, private cosplaysService: CosplaysService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
        return;
      }
      // load the cosplay
      this.cosplay = this.cosplaysService.getCosplay(paramMap.get('cosplayId'));
    });
  }

  onEditCosplay() {
    // this.router.navigateByUrl('/main/tabs/cosplays/my-cosplays');
    this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
  }

}
