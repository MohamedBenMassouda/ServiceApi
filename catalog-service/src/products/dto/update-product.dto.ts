import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Min, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 1199.99, description: 'Price (must be > 0)' })
  @IsOptional()
  @IsPositive({ message: 'price must be strictly positive' })
  price?: number;

  @ApiPropertyOptional({ example: 30, description: 'Stock quantity (>= 0)' })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'stock must be positive or zero' })
  stock?: number;
}
