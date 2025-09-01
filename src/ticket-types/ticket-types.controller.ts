import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketTypesService } from './ticket-types.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ticket-types')
@Controller('ticket-types')
export class TicketTypesController {
  constructor(private readonly ticketTypesService: TicketTypesService) {}

  // 🔒 Apenas ADMIN cria tipos de ingresso
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Criar um tipo de ingresso (ADMIN)' })
  create(@Body() dto: CreateTicketTypeDto) {
    return this.ticketTypesService.create(dto);
  }

  // 👥 Qualquer logado pode listar
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todos os tipos de ingresso' })
  findAll() {
    return this.ticketTypesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Obter um tipo de ingresso' })
  findOne(@Param('id') id: string) {
    return this.ticketTypesService.findOne(id);
  }

  // 🔒 Apenas ADMIN pode atualizar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tipo de ingresso (ADMIN)' })
  update(@Param('id') id: string, @Body() dto: UpdateTicketTypeDto) {
    return this.ticketTypesService.update(id, dto);
  }

  // 🔒 Apenas ADMIN pode deletar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tipo de ingresso (ADMIN)' })
  remove(@Param('id') id: string) {
    return this.ticketTypesService.remove(id);
  }
}
