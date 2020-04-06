import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyCosplaysPage } from './my-cosplays.page';

describe('MyCosplaysPage', () => {
  let component: MyCosplaysPage;
  let fixture: ComponentFixture<MyCosplaysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCosplaysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyCosplaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
