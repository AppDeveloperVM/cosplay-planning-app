import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosElementTomakeModalComponent } from './cos-element-tomake-modal.component';

describe('CosElementTomakeModalComponent', () => {
  let component: CosElementTomakeModalComponent;
  let fixture: ComponentFixture<CosElementTomakeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CosElementTomakeModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosElementTomakeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
