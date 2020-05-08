import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosplayGroupSendRequestComponent } from './cosplay-group-send-request.component';

describe('CosplayGroupSendRequestComponent', () => {
  let component: CosplayGroupSendRequestComponent;
  let fixture: ComponentFixture<CosplayGroupSendRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosplayGroupSendRequestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosplayGroupSendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
