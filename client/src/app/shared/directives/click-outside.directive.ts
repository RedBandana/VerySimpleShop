import { DOCUMENT } from '@angular/common';
import { 
  AfterViewInit, 
  Directive, 
  ElementRef, 
  EventEmitter, 
  Inject, 
  Input, 
  NgZone, 
  OnDestroy, 
  Output, 
  inject 
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Input() appClickOutsideIgnore: string = '';
  @Input() appClickOutsideEnabled: boolean = true;
  @Output() appClickOutside = new EventEmitter<MouseEvent>();
  
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);
  private zone = inject(NgZone);
  
  private unregisterClickListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const listener = (event: MouseEvent) => {
        if (!this.appClickOutsideEnabled) {
          return;
        }
        
        // Check if click was inside the element
        if (!this.elementRef.nativeElement.contains(event.target)) {
          // Check if we should ignore the click
          if (this.appClickOutsideIgnore) {
            const ignoreElements = this.document.querySelectorAll(this.appClickOutsideIgnore);
            for (let i = 0; i < ignoreElements.length; i++) {
              if (ignoreElements[i].contains(event.target as Node)) {
                return;
              }
            }
          }
          
          this.zone.run(() => {
            this.appClickOutside.emit(event);
          });
        }
      };
      
      // Use addEventListener with capture phase to ensure we handle the event first
      this.document.addEventListener('click', listener, true);
      this.unregisterClickListener = () => {
        this.document.removeEventListener('click', listener, true);
      };
    });
  }

  ngOnDestroy(): void {
    if (this.unregisterClickListener) {
      this.unregisterClickListener();
      this.unregisterClickListener = null;
    }
  }
}