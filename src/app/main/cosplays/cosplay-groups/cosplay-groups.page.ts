import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { CosplayGroupService } from './cosplay-group.service';
import { Subscription } from 'rxjs';

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

  constructor(private cosplaygroupService: CosplayGroupService) { }

  ngOnInit() {
    this.cosplayGroupsSub = this.cosplaygroupService.cosplaygroups.subscribe(cosplaygroups => {
      this.cosplaygroups = cosplaygroups;
    });
  }

  ngOnDestroy() {
    if (this.cosplayGroupsSub) {
      this.cosplayGroupsSub.unsubscribe();
    }
  }



}
