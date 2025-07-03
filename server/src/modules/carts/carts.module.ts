import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { CartSchema } from './schemas/cart.schema';
import { StripeService } from 'src/services/stripe/stripe.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseModel.CART, schema: CartSchema }])],
  providers: [CartsService, StripeService],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {}
