import { IsNumber } from "class-validator";

export class UpdateCartDto {
  @IsNumber()
  customerId?: number;
  totalPrice?: number;
}
