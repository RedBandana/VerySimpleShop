import {
    Controller,
    Logger,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
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
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
    }),
)
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);

    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.createDocument(createProductDto);
    }

    @Get()
    async getAll(@Query() getProductsDto: GetProductsDto) {
        return await this.productsService.getAll(getProductsDto);
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        return await this.productsService.get(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productsService.updateDocument(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        await this.productsService.delete(id);
    }
}
