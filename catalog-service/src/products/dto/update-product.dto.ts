import { IsInt, IsOptional, IsPositive, IsString, Min, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPositive({ message: 'price must be strictly positive' })
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'stock must be positive or zero' })
  stock?: number;
}
