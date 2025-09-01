// src/events/dto/create-event.dto.ts

import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  thumbMobile?: string; // URL da imagem
  @IsString()
  @IsOptional()
  thumbDesktop?: string; // URL da imagem
  @IsString()
  @IsOptional()
  thumbDestaque?: string; // URL da imagem
}
