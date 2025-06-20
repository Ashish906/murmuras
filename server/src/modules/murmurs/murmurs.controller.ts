import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { UpdateMurmurDto } from './dto/update-murmur.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('murmurs')
@UseGuards(AuthGuard)
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) {}

  @Post()
  create(
    @Body() createMurmurDto: CreateMurmurDto,
    @Request() req: any
  ) {
    return this.murmursService.create(createMurmurDto, req.user);
  }

  @Post('like/:murmur_id/:type')
  like(
    @Param('murmur_id', ParseIntPipe) murmur_id: number,
    @Param('type', ParseIntPipe) type: number,
    @Request() req: any
  ) {
    return this.murmursService.like(murmur_id, type, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) murmur_id: number,
    @Request() req: any
  ) {
    return this.murmursService.remove(murmur_id, req.user);
  }

  @Get('specific-user/:user_id')
  getUserMurmurs(
    @Param('user_id', ParseIntPipe) userId: number,
    @Request() req: any
  ) {
    return this.murmursService.getUserMurmurs(userId, req.user);
  }

  @Get('timeline')
  getTimeline(
    @Query() pagination: PaginationDto,
    @Request() req: any
  ) {
    return this.murmursService.getMurmurTimeline(pagination, req.user);
  }
}
