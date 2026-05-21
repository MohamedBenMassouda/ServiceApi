import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15', description: 'Product name' })
  @IsString()
  @IsNotEmpty({ message: 'name must not be empty' })
  name: string;

  @ApiProperty({ example: 999.99, description: 'Price (must be > 0)' })
  @IsPositive({ message: 'price must be strictly positive' })
  price: number;

  @ApiProperty({ example: 50, description: 'Stock quantity (>= 0)' })
  @IsInt()
  @Min(0, { message: 'stock must be positive or zero' })
  stock: number;
}
