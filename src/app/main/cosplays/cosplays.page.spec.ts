import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CosplaysPage } from './cosplays.page';

describe('CosplaysPage', () => {
  let component: CosplaysPage;
  let fixture: ComponentFixture<CosplaysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosplaysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CosplaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
