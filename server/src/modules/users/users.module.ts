import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { FollowingHistory } from './entities/following-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      FollowingHistory
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
