import { PartialType } from '@nestjs/mapped-types';
import { CartDto } from './cart.dto';

export class CreateCartDto extends PartialType(CartDto) { }