import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';

export class CreateProductDto extends PartialType(ProductDto) {}