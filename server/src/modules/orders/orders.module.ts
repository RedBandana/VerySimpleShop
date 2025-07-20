import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { OrderSchema } from './schemas/order.schema';
import { CartsModule } from '../carts/carts.module';
import { StripeService } from 'src/services/stripe/stripe.service';
import { MailService } from '../mail/mail.service';
import { LocalizationService } from 'src/services/localization/localization.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DatabaseModel.ORDER, schema: OrderSchema }]),
    CartsModule,
  ],
  providers: [OrdersService, StripeService, MailService, LocalizationService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule { }
