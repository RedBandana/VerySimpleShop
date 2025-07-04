import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeService } from './services/stripe/stripe.service';
import { WebhookController } from './controllers/webhook/webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { getSourceDirectory } from './common/utils/functions.utils';
import { ScheduleModule } from '@nestjs/schedule';
import { DEFAULT_LANGUAGE } from './common/constants/general.constant';
import { AuthModule } from './modules/auth/auth.module';
import { CartsModule } from './modules/carts/carts.module';
import { JwtAuthModule } from './modules/jwt-auth/jwt-auth.module';
import { MailModule } from './modules/mail/mail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING ?? ""),
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path: getSourceDirectory() + '/assets/i18n/',
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        { use: CookieResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CartsModule,
    JwtAuthModule,
    MailModule,
    OrdersModule,
    ProductsModule,
    TokensModule,
    UsersModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, StripeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // Apply for all routes, or specify routes as needed
  }
}
