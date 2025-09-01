import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Ex.: Pista, VIP

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  eventId: string;
}
