import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPlanningPage } from './edit-planning.page';

describe('EditPlanningPage', () => {
  let component: EditPlanningPage;
  let fixture: ComponentFixture<EditPlanningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlanningPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
