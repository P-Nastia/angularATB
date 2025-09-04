import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAccessError } from './server-access-error';

describe('ServerAccessError', () => {
  let component: ServerAccessError;
  let fixture: ComponentFixture<ServerAccessError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerAccessError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerAccessError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
