import {
  Component,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { XDropdownPrefix, XDropdownNode, XDropdownProperty } from './dropdown.property';
import { XIsChange, XIsEmpty, XSetData, XGetChildren, XConfigService, XPositionTopBottom } from '@ng-nest/ui/core';
import { Subject } from 'rxjs';
import { XPortalConnectedPosition, XPortalOverlayRef, XPortalService } from '@ng-nest/ui/portal';
import { XDropdownPortalComponent } from './dropdown-portal.component';
import { debounceTime, takeUntil, throttleTime } from 'rxjs/operators';
import { ConnectedOverlayPositionChange, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig } from '@angular/cdk/overlay';

@Component({
  selector: `${XDropdownPrefix}`,
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XDropdownComponent extends XDropdownProperty implements OnChanges {
  @ViewChild('dropdown', { static: true }) dropdown: ElementRef;
  datas: XDropdownNode[] = [];
  nodes: XDropdownNode[] = [];
  portal: XPortalOverlayRef<XDropdownPortalComponent>;
  timeoutHide: any;
  visible: boolean = false;
  animating = false;
  outsideClick = false;
  positionChange: Subject<any> = new Subject();
  closeSubject: Subject<any> = new Subject();
  private _unSubject = new Subject<void>();

  constructor(
    public renderer: Renderer2,
    public elementRef: ElementRef,
    public cdr: ChangeDetectorRef,
    private portalService: XPortalService,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    public configService: XConfigService
  ) {
    super();
  }

  ngOnInit() {
    this.setSubject();
  }

  ngOnChanges(changes: SimpleChanges) {
    XIsChange(changes.data) && this.setData();
  }

  ngOnDestroy(): void {
    this._unSubject.next();
    this._unSubject.unsubscribe();
  }

  setSubject() {
    this.closeSubject.pipe(takeUntil(this._unSubject)).subscribe((x) => {
      this.closePortal();
    });
  }

  onEnter() {
    if (this.disabled || this.trigger === 'click') return;
    if (this.timeoutHide) clearTimeout(this.timeoutHide);
    if (!this.portal || (this.portal && !this.portal?.overlayRef?.hasAttached())) {
      this.visible = true;
      this.createPortal();
      this.cdr.detectChanges();
    }
  }

  onLeave() {
    if (this.disabled || this.trigger === 'click') return;
    if (this.portal?.overlayRef?.hasAttached()) {
      this.timeoutHide = setTimeout(() => {
        this.visible = false;
        this.portal?.overlayRef?.dispose();
        this.cdr.detectChanges();
      });
    }
  }

  showPortal() {
    if (this.disabled || this.trigger === 'hover' || this.animating) return;
    if (this.trigger === 'click' && this.portalAttached()) {
      this.closeSubject.next();
      return;
    }
    this.createPortal();
  }

  portalAttached() {
    return this.portal?.overlayRef?.hasAttached();
  }

  closePortal() {
    if (this.portalAttached()) {
      this.portal?.overlayRef?.dispose();
      return true;
    }
    return false;
  }

  destroyPortal() {
    this.portal?.overlayRef?.dispose();
  }

  createPortal() {
    const config: OverlayConfig = {
      backdropClass: '',
      positionStrategy: this.setPlacement(),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    };
    this.setPosition(config);
    this.portal = this.portalService.attach({
      content: XDropdownPortalComponent,
      viewContainerRef: this.viewContainerRef,
      overlayConfig: config
    });
    if (this.trigger === 'click') {
      this.portal.overlayRef
        ?.outsidePointerEvents()
        .pipe(debounceTime(30), takeUntil(this._unSubject))
        .subscribe(() => {
          this.closeSubject.next();
        });
    }
    this.setInstance();
  }

  setPosition(config: OverlayConfig) {
    let position = config.positionStrategy as FlexibleConnectedPositionStrategy;
    position.positionChanges.pipe(takeUntil(this._unSubject)).subscribe((pos: ConnectedOverlayPositionChange) => {
      const place = XPortalConnectedPosition.get(pos.connectionPair) as XPositionTopBottom;
      place !== this.placement && this.positionChange.next(place);
    });
  }

  setInstance() {
    let componentRef = this.portal?.componentRef;
    if (!componentRef) return;
    Object.assign(componentRef.instance, {
      data: this.nodes,
      trigger: this.trigger,
      close: () => this.closeSubject.next(),
      positionChange: this.positionChange,
      destroyPortal: () => this.destroyPortal(),
      nodeEmit: (node: XDropdownNode) => this.nodeClick.emit(node),
      portalHover: (hover: boolean) => this.portalHover(hover),
      animating: (ing: boolean) => (this.animating = ing)
    });
    componentRef.changeDetectorRef.detectChanges();
  }

  portalHover(hover: boolean) {
    if (this.timeoutHide && hover) {
      clearTimeout(this.timeoutHide);
    } else {
      this.onLeave();
    }
  }

  setPlacement() {
    return this.portalService.setPlacement({
      elementRef: this.dropdown,
      placement: [this.placement, 'bottom-start', 'top-start', 'bottom-end', 'top-end'],
      transformOriginOn: 'x-dropdown-portal'
    });
  }

  private setData() {
    XSetData<XDropdownNode>(this.data, this._unSubject).subscribe((x) => {
      this.datas = x;
      if (!this.children) {
        this.nodes = x.filter((y) => XIsEmpty(y.pid)).map((y) => XGetChildren<XDropdownNode>(x, y, 0));
      } else {
        this.nodes = x;
      }
      this.cdr.detectChanges();
    });
  }
}
