import { IsNumber } from "class-validator";


export class CreateCartDto {
  @IsNumber()
  customerId: number;
  totalPrice: number;
}
