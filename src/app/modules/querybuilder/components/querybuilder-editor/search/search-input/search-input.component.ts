import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay'
import { CritType } from '../../../../model/api/query/group'
import { merge, Observable, Subscription } from 'rxjs'
import { MatInput } from '@angular/material/input'
import { FocusMonitor } from '@angular/cdk/a11y'
import { filter, mapTo } from 'rxjs/operators'
import { MatFormField } from '@angular/material/form-field'

@Component({
  selector: 'num-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input()
  critType: CritType = 'inclusion'

  searchMode: SearchMode = 'text'

  search = ''

  showOverlay$: Observable<boolean>
  activateOverlay$: Observable<boolean>
  deactivateOverlay$: Observable<boolean>
  focusInputField$: Observable<boolean>

  isOverlayOpen = false

  positions: ConnectedPosition[] = []

  subscriptions: Subscription[] = []

  @ViewChild(MatInput, { read: ElementRef, static: true })
  private inputFieldEl: ElementRef

  @ViewChild(MatFormField, { read: ElementRef, static: true })
  private inputEl: ElementRef

  @ViewChild(CdkConnectedOverlay, { static: true })
  public connectedOverlay: CdkConnectedOverlay

  constructor(private focusMonitor: FocusMonitor) {}

  ngOnInit(): void {
    this.initPositionStrategy()
    this.initAndSubscribeToOverlayObservables()
  }

  private initAndSubscribeToOverlayObservables(): void {
    this.focusInputField$ = this.focusMonitor.monitor(this.inputFieldEl).pipe(
      filter((focus) => !!focus),
      mapTo(true)
    )

    this.activateOverlay$ = this.focusMonitor.monitor(this.inputEl).pipe(
      filter((focus) => !!focus),
      mapTo(true)
    )
    this.deactivateOverlay$ = merge(
      this.connectedOverlay.backdropClick,
      this.connectedOverlay.detach
    ).pipe(mapTo(false))

    this.showOverlay$ = merge(this.activateOverlay$, this.deactivateOverlay$)

    this.subscriptions.push(
      this.showOverlay$.subscribe((value) => {
        this.isOverlayOpen = value
      })
    )

    this.subscriptions.push(
      this.focusInputField$.subscribe((value) => {
        this.searchMode = 'text'
        this.isOverlayOpen = true
      })
    )
  }

  private initPositionStrategy(): void {
    let positionVertical
    if (this.critType === 'exclusion') {
      positionVertical = 'end'
    } else {
      positionVertical = 'start'
    }

    this.positions = [
      {
        originX: positionVertical,
        originY: 'bottom',
        overlayX: positionVertical,
        overlayY: 'top',
      },
    ]
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  getHeaderLabelKey(): string {
    return this.critType.toUpperCase()
  }

  switchSearchMode($event: MouseEvent): void {
    this.searchMode = this.searchMode === 'tree' ? 'text' : 'tree'
    if (this.searchMode === 'tree') {
      this.isOverlayOpen = true
    } else {
      this.isOverlayOpen = !!this.search
    }
  }

  closeOverlay(mode: SearchMode): void {
    if (mode === 'text') {
      this.search = ''
    }
    this.isOverlayOpen = false
  }
}

export type SearchMode = 'text' | 'tree'
