import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DisplayValueFilterComponent } from './display-value-filter.component'

describe('DisplayValueFilterComponent', () => {
  let component: DisplayValueFilterComponent
  let fixture: ComponentFixture<DisplayValueFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayValueFilterComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayValueFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
