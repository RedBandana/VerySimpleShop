// shared/pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 100, completeWords = false, ellipsis = '...'): string {
        if (!value) {
            return '';
        }

        if (value.length <= limit) {
            return value;
        }

        if (completeWords) {
            limit = value.substring(0, limit).lastIndexOf(' ');
        }

        return `${value.substring(0, limit)}${ellipsis}`;
    }
}