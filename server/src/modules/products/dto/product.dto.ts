import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, ValidateNested, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOptionChoiceDto {
    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsNotEmpty()
    valueKey: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class ProductOptionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nameKey: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionChoiceDto)
    choices: ProductOptionChoiceDto[];
}

export class ProductVariantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsArray()
    @IsString({ each: true })
    imageUrls: string[];

    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;

    @IsObject()
    specifications: any;
}

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsArray()
    @IsString({ each: true })
    imageUrls: string[];

    @IsArray()
    @IsString({ each: true })
    collections: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionDto)
    options: ProductOptionDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    variants: ProductVariantDto[];
}