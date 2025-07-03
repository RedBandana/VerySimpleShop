import 'dotenv/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentTypes } from 'src/common/enums/environment-types.enum';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) { }

    async sendMail(mail: ISendMailOptions) {
        if (process.env.ENVIRONMENT === EnvironmentTypes.DEV) {
            this.logger.verbose('sendMail dev', mail);
            return;
        }

        this.logger.verbose('sendMail');
        await this.mailerService.sendMail(mail);
    }
}
