import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConventionsPage } from './conventions.page';

describe('ConventionsPage', () => {
  let component: ConventionsPage;
  let fixture: ComponentFixture<ConventionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConventionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConventionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
