import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  constructor(private readonly i18n: I18nService) { }

  transform(value: string): Date {
    if (!isValidDate(value)) {
      const errorMessage = this.i18n.translate('general.errors.badRequest', {
        lang: I18nContext.current()?.lang,
      });
      throw new BadRequestException(errorMessage);
    }

    return new Date(value);
  }
}

@Injectable()
export class ParseUnrequiredDatePipe implements PipeTransform<string, Date | undefined> {
  constructor(private readonly i18n: I18nService) { }

  transform(value: string): Date | undefined {
    try {
      value.toString();
    } catch {
      return undefined;
    }

    if (!value) return undefined;

    if (!isValidDate(value)) {
      const errorMessage = this.i18n.translate('general.errors.badRequest', {
        lang: I18nContext.current()?.lang,
      });
      throw new BadRequestException(errorMessage);
    }

    return new Date(value);
  }
}
