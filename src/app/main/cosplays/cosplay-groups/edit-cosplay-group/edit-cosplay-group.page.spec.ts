import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCosplayGroupPage } from './edit-cosplay-group.page';

describe('EditCosplayGroupPage', () => {
  let component: EditCosplayGroupPage;
  let fixture: ComponentFixture<EditCosplayGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCosplayGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCosplayGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
