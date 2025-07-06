import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductsService extends DatabaseCollectionService {

    constructor(
        @InjectModel(DatabaseModel.PRODUCT) protected readonly productModel: Model<Product>,
    ) {
        super(productModel);
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = await this.createDocument(createProductDto);
        return product;
    }

    async getAll(getProductsDto: GetProductsDto): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, search, collections, minPrice, maxPrice } = getProductsDto;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (collections && collections.length > 0) {
            filter.collections = { $in: collections };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) {
                filter.price.$gte = minPrice;
            }
            if (maxPrice !== undefined) {
                filter.price.$lte = maxPrice;
            }
        }

        const [products, total] = await Promise.all([
            this.filterBy(filter, { skip, limit }),
            this.productModel.countDocuments(filter).lean().exec(),
        ]);

        return {
            products,
            total,
            page,
            limit,
        };
    }

    async get(productId: ObjectId): Promise<Product> {
        const product = await this.getDocument(productId);
        return product;
    }

    async update(productId: ObjectId, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.updateDocument(productId, updateProductDto);
        return product;
    }

    async delete(productId: ObjectId): Promise<void> {
        await this.deleteDocument(productId);
    }
}
