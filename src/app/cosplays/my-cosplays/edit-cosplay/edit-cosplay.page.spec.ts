import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCosplayPage } from './edit-cosplay.page';

describe('EditCosplayPage', () => {
  let component: EditCosplayPage;
  let fixture: ComponentFixture<EditCosplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCosplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCosplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
