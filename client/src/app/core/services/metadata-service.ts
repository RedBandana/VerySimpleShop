import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  constructor(
    private meta: Meta,
    private title: Title,
    private translateService: TranslateService,
  ) { }

  setMetadata(title: string, description: string, keywords: string) {
    if (title && title.trim()) this.title.setTitle(title);

    if (description && description.trim()) this.meta.updateTag({ name: 'description', content: description });

    if (keywords && keywords.trim()) this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  setPageMetadata(pageTranslationKey: string) {
    const translationKeys = [
      `${pageTranslationKey}.title`,
      `${pageTranslationKey}.description`,
      `${pageTranslationKey}.keywords`,
    ];

    this.translateService.get(translationKeys).subscribe((translations: any) => {
      this.setMetadata(
        translations[`${pageTranslationKey}.title`] != `${pageTranslationKey}.title`
          ? translations[`${pageTranslationKey}.title`]
          : '',
        translations[`${pageTranslationKey}.description`] != `${pageTranslationKey}.description`
          ? translations[`${pageTranslationKey}.description`]
          : '',
        translations[`${pageTranslationKey}.keywords`] != `${pageTranslationKey}.keywords`
          ? translations[`${pageTranslationKey}.keywords`]
          : '',
      );
    });
  }
}
