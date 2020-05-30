import { Component, OnInit } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit {
  loadedCosplays: Cosplay[];
  listedLoadedCosplays: Cosplay[];
  relevantCosplays: Cosplay[];

  constructor(
    private cosplaysService: CosplaysService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadedCosplays = this.cosplaysService.cosplays;

    this.relevantCosplays = this.loadedCosplays;

    this.listedLoadedCosplays = this.loadedCosplays.slice(0);
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantCosplays = this.loadedCosplays; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantCosplays = this.loadedCosplays.filter(
        cosplay => cosplay.status !== true // checking status
      );
    }
    this.listedLoadedCosplays = this.relevantCosplays.slice(0);
    console.log(event.detail);
  }

}
