import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'name must not be empty' })
  name: string;

  @IsPositive({ message: 'price must be strictly positive' })
  price: number;

  @IsInt()
  @Min(0, { message: 'stock must be positive or zero' })
  stock: number;
}
