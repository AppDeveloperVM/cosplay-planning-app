import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewCosplayGroupPage } from './new-cosplay-group.page';

describe('NewCosplayGroupPage', () => {
  let component: NewCosplayGroupPage;
  let fixture: ComponentFixture<NewCosplayGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCosplayGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCosplayGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
