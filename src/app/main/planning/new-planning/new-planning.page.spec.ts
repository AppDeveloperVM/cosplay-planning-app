import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPlanningPage } from './new-planning.page';

describe('NewPlanningPage', () => {
  let component: NewPlanningPage;
  let fixture: ComponentFixture<NewPlanningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlanningPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
