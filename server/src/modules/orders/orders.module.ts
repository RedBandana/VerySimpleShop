import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { OrderSchema } from './schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseModel.ORDER, schema: OrderSchema }])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
