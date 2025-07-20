import 'dotenv/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentTypes } from 'src/common/enums/environment-types.enum';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) { }

    async sendMail(mail: ISendMailOptions) {
        if (process.env.NODE_ENV === EnvironmentTypes.DEV)
            return;

        await this.mailerService.sendMail(mail);
    }
}
