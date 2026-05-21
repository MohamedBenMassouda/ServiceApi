import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsPositive } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: "ID of the product to order" })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 2, description: "Number of units to order" })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: "customer@example.com", description: "Customer email address" })
  @IsEmail()
  customerEmail: string;
}
