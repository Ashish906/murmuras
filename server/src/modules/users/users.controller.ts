import { Controller, Get, UseGuards, Request, Post, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  getMe(
    @Request() req: any
  ) {
    return this.usersService.getMe(req.user);
  }

  @Get('/all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:user_id')
  getUserById(
    @Param('user_id', ParseIntPipe) userId: number
  ) {
    return this.usersService.getUserById(userId);
  }

  @Post('/follow/:user_id/:type')
  followUser(
    @Param('user_id', ParseIntPipe) userId: number,
    @Param('type', ParseIntPipe) type: number,
    @Request() req: any
  ) {
    return this.usersService.followUser(userId, type, req.user);
  }
}
