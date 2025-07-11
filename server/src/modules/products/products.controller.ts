import {
    Controller,
    Logger,
    UseGuards,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ObjectId } from 'mongodb';
import { ResponseUtil } from 'src/common/utils/response.util';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);

    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponse<any>> {
        const product = await this.productsService.createDocument(createProductDto);
        return ResponseUtil.success(product, 'Product created successfully', HttpStatus.CREATED);
    }

    @Get()
    async getAll(@Query() getProductsDto: GetProductsDto): Promise<PaginatedApiResponse<any> | ApiResponse<any>> {
        const result = await this.productsService.getAll(getProductsDto);
        
        if (result.page && result.limit && result.total) {
            return ResponseUtil.paginated(
                result.products,
                result.page,
                result.limit,
                result.total,
                'Products retrieved successfully'
            );
        }
        
        return ResponseUtil.success(result.products, 'Products retrieved successfully');
    }

    @Get(':productId')
    async get(@Param('productId', ParseObjectIdPipe) productId: ObjectId): Promise<ApiResponse<any>> {
        const product = await this.productsService.get(productId);
        return ResponseUtil.success(product, 'Product retrieved successfully');
    }

    @Put(':productId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(@Param('productId', ParseObjectIdPipe) productId: ObjectId, @Body() updateProductDto: UpdateProductDto): Promise<ApiResponse<any>> {
        const product = await this.productsService.updateDocument(productId, updateProductDto);
        return ResponseUtil.success(product, 'Product updated successfully');
    }

    @Delete(':productId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('productId', ParseObjectIdPipe) productId: ObjectId): Promise<ApiResponse<null>> {
        await this.productsService.delete(productId);
        return ResponseUtil.success(null, 'Product deleted successfully', HttpStatus.NO_CONTENT);
    }
}
