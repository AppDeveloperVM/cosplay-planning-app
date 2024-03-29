import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { CosplayGroupService } from '../../../services/cosplay-group.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NoticesService } from '../../../services/notices.service';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';


@Component(
  {
  selector: 'app-cosplay-groups',
  templateUrl: './cosplay-groups.page.html',
  styleUrls: ['./cosplay-groups.page.scss'],
  }
)

export class CosplayGroupsPage implements OnInit, OnDestroy {
  cosGroups$ = this.cosplaygroupService.cosGroups;


  cosplaygroups: CosplayGroup[];
  private cosplayGroupsSub: Subscription;

  loadedCosplayGroups: CosplayGroup[];
  listedLoadedCosplays: CosplayGroup[];
  relevantCosplayGroups: CosplayGroup[];

  my_requested: CosplayGroup[];

  private cosplaysGSub: Subscription;
  private filter = 'all';
  isLoading = false;

  constructor(
    private router: Router,
    private cosplaygroupService: CosplayGroupService,
    private authService: AuthService,
    private noticesService: NoticesService,
    private readonly afs: AngularFirestore
  ) {
    
  }

  ngOnInit() {

    this.isLoading = true;
    this.cosGroups$.subscribe(cosGroup => {
      this.isLoading = false;
    });

    /* this.cosplayGroupsSub = this.cosplaygroupService.cosplaygroups.subscribe(cosplaygroups => {
      this.cosplaygroups = cosplaygroups;
      this.loadedCosplayGroups = cosplaygroups;
      this.listedLoadedCosplays = this.loadedCosplayGroups;
      this.onFilterUpdate(this.filter);
    }) */
  }

  ionViewWillEnter() {

  }

  /* onFilterUpdate(filter: string) {
    if (filter === 'all') {
      this.relevantCosplayGroups = this.loadedCosplayGroups; // show everything (?)

    //test
    }else if(filter === 'requested'){
      this.relevantCosplayGroups
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantCosplayGroups = this.loadedCosplayGroups.filter(
        cosplaygroup => cosplaygroup.userId !== this.authService.userId // checking creator
      );
    }
    this.listedLoadedCosplays = this.relevantCosplayGroups;
    console.log(filter);
  } */

  getCosplayGroupById(cosGroupId: string = 'c9d0WYQfry6e5Xfz5Q2G') {
    return this.afs
    .collection('cosplay-groups')
    .doc(cosGroupId)
    .valueChanges()
  }

  onFilterUpdate($event) {
    
  }

  ngOnDestroy() {
    if (this.cosplayGroupsSub) {
      this.cosplayGroupsSub.unsubscribe();
    }
  }



}
