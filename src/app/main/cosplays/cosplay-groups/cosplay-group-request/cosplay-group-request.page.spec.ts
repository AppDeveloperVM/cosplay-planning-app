import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosplayGroupRequestPage } from './cosplay-group-request.page';

describe('CosplayGroupRequestPage', () => {
  let component: CosplayGroupRequestPage;
  let fixture: ComponentFixture<CosplayGroupRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosplayGroupRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosplayGroupRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
