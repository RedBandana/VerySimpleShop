import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyCodes } from '../enums';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {
    constructor(private translateService: TranslateService) { }

    formatCurrency(value: number): string {
        const currencyString = new Intl.NumberFormat(this.translateService.currentLang, {
            style: 'currency',
            currency: CurrencyCodes.CANADIAN_DOLLAR,
        }).format(value);

        return currencyString;
    }
}
