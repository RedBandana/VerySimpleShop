import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { I18nService } from 'nestjs-i18n';
import { registerHandlebarsHelpers } from './handlebars-helpers';
import { getSourceDirectory } from 'src/common/utils/functions.utils';
import { DEFAULT_MAIL_PORT } from 'src/common/constants/general.constant';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [I18nService],
      useFactory: (i18n: I18nService) => {
        registerHandlebarsHelpers();

        return {
          transport: {
            host: process.env.MAIL_HOST,
            port: +(process.env.MAIL_PORT || DEFAULT_MAIL_PORT),
            ignoreTLS: false,
            secure: false,
            auth: {
              user: process.env.MAIL_FROM,
              pass: process.env.SMTP_TOKEN,
            },
          },
          defaults: {
            from: `"VSS" <${process.env.MAIL_FROM}>`,
          },
          template: {
            dir: getSourceDirectory() + '/assets/mail-templates/',
            adapter: new HandlebarsAdapter({
              t: i18n.hbsHelper,
            }),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
