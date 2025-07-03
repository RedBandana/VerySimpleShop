import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId> {
  constructor(private readonly i18n: I18nService) { }

  transform(value: string): ObjectId {
    if (!isValidObjectId(value)) {
      const errorMessage = this.i18n.translate('general.errors.badRequest', {
        lang: I18nContext.current()?.lang,
      });
      throw new BadRequestException(errorMessage);
    }

    return new ObjectId(value);
  }
}

@Injectable()
export class ParseUnrequiredObjectIdPipe implements PipeTransform<string, ObjectId | undefined> {
  constructor(private readonly i18n: I18nService) { }

  transform(value: string): ObjectId | undefined {
    try {
      value.toString();
    } catch {
      // Handle Cannot create Buffer from undefined error message
      return undefined;
    }

    if (!value) return undefined;

    if (!isValidObjectId(value)) {
      const errorMessage = this.i18n.translate('general.errors.badRequest', {
        lang: I18nContext.current()?.lang,
      });
      throw new BadRequestException(errorMessage);
    }

    return new ObjectId(value);
  }
}
