import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewCosplayPage } from './new-cosplay.page';

describe('NewCosplayPage', () => {
  let component: NewCosplayPage;
  let fixture: ComponentFixture<NewCosplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCosplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCosplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
