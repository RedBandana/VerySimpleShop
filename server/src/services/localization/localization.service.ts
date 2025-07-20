import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';
import { DEFAULT_LANGUAGE } from 'src/common/constants/general.constant';
import { CurrencyCodes } from 'src/common/enums/currency-codes.enum';

@Injectable()
export class LocalizationService {
    get lang(): string {
        return I18nContext.current()?.lang || DEFAULT_LANGUAGE;
    }

    constructor(private i18n: I18nService) { }

    translate(key: string, options: TranslateOptions): string {
        return this.i18n.translate(key, options);
    }

    formatCurrency(value: number): string {
        const currencyString = new Intl.NumberFormat(this.lang, {
            style: 'currency',
            currency: CurrencyCodes.CANADIAN_DOLLAR,
        }).format(value);

        return currencyString;
    }
}
