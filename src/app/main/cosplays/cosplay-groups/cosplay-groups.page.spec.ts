import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosplayGroupsPage } from './cosplay-groups.page';

describe('CosplayGroupsPage', () => {
  let component: CosplayGroupsPage;
  let fixture: ComponentFixture<CosplayGroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosplayGroupsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosplayGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
