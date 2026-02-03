import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appXyzDirective]',
})
export class XyzDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}  