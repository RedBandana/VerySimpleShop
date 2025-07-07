// shared/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, property?: string): any[] {
        if (!items) {
            return [];
        }
        
        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter(item => {
            if (property) {
                return item[property].toLowerCase().includes(searchText);
            }

            return Object.keys(item).some(key => {
                const value = item[key];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchText);
                }
                return false;
            });
        });
    }
}