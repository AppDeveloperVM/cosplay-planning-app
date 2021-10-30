import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosElementModalComponent } from './cos-element-modal.component';

describe('CosElementModalComponent', () => {
  let component: CosElementModalComponent;
  let fixture: ComponentFixture<CosElementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosElementModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosElementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
