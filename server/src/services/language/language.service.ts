import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserTypes } from 'src/common/enums/user-types.enum';
import { DEFAULT_LANGUAGE } from 'src/common/constants/general.constant';

@Injectable()
export class LanguageService {
    get lang(): string {
        return I18nContext.current()?.lang || DEFAULT_LANGUAGE;
    }

    constructor(private i18n: I18nService) { }

    get userTypes() {
        return new Map<UserTypes, string>([
            [UserTypes.APPLICATION, this.i18n.translate('general.enums.userTypes.application', { lang: this.lang })],
            [UserTypes.GUEST, this.i18n.translate('general.enums.userTypes.guest', { lang: this.lang })],
            [UserTypes.NORMAL, this.i18n.translate('general.enums.userTypes.normal', { lang: this.lang })],
            [UserTypes.PREMIUM, this.i18n.translate('general.enums.userTypes.premium', { lang: this.lang })],
        ]);
    }
}
