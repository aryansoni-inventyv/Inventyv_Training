import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xyxPipe',
})
export class XyxPipePipe implements PipeTransform {

  transform(value: string, format?: string): string {
    // Example: Format a date string
    if (!value) return '';
    
    const date = new Date(value);
    
    if (format === 'fulldate') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US');
    } 
    
    return date.toISOString();
  }
}
