import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { CosplayGroupService } from './cosplay-group.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component(
  {
  selector: 'app-cosplay-groups',
  templateUrl: './cosplay-groups.page.html',
  styleUrls: ['./cosplay-groups.page.scss'],
}
)

export class CosplayGroupsPage implements OnInit, OnDestroy {
  cosplaygroups: CosplayGroup[];
  private cosplayGroupsSub: Subscription;

  loadedCosplayGroups: CosplayGroup[];
  listedLoadedCosplays: CosplayGroup[];
  relevantCosplayGroups: CosplayGroup[];
  private cosplaysGSub: Subscription;
  private filter = 'all';

  constructor(private cosplaygroupService: CosplayGroupService, private authService: AuthService) { }

  ngOnInit() {
    this.cosplayGroupsSub = this.cosplaygroupService.cosplaygroups.subscribe(cosplaygroups => {
      this.cosplaygroups = cosplaygroups;
      this.loadedCosplayGroups = cosplaygroups;
      this.listedLoadedCosplays = this.loadedCosplayGroups;
      this.onFilterUpdate(this.filter);
    });
  }

  onFilterUpdate(filter: string) {
    if (filter === 'all') {
      this.relevantCosplayGroups = this.loadedCosplayGroups; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantCosplayGroups = this.loadedCosplayGroups.filter(
        cosplaygroup => cosplaygroup.userId !== this.authService.userId // checking creator
      );
    }
    this.listedLoadedCosplays = this.relevantCosplayGroups;
    console.log(filter);
  }


  ngOnDestroy() {
    if (this.cosplayGroupsSub) {
      this.cosplayGroupsSub.unsubscribe();
    }
  }



}
