import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosElementTobuyModalComponent } from './cos-element-tobuy-modal.component';

describe('CosElementTobuyModalComponent', () => {
  let component: CosElementTobuyModalComponent;
  let fixture: ComponentFixture<CosElementTobuyModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CosElementTobuyModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosElementTobuyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
