import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseModel.PRODUCT, schema: ProductSchema }])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
