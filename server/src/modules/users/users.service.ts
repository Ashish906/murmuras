import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { FollowingHistory } from './entities/following-history.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FollowingHistory)
    private readonly followingHistoryRepository: Repository<FollowingHistory>
  ) {}

  async getMe(user: any) {
    const userInfo = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'followers_count', 'following_count'],
      where: { 
        id: user.id,
        is_active: true
      }
    });

    return userInfo;
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'followers_count', 'following_count'],
      where: { is_active: true }
    });

    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'followers_count', 'following_count'],
      where: { id: userId, is_active: true }
    });

    return user;
  }

  async followUser(userId: number, type: number, user: any) {
    const followerId = user.id;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      let counter = 1;
      if(type === 1) {
        await transactionalEntityManager.save(FollowingHistory, {
          follower: followerId,
          following: userId
        });
      } else {
        // Unfollow
        await transactionalEntityManager.softDelete(FollowingHistory, {
          follower: followerId,
          following: userId
        });
        counter = -1;
      }
      await transactionalEntityManager.increment(User, { id: userId }, 'followers_count', counter);
      await transactionalEntityManager.increment(User, { id: followerId }, 'following_count', counter);
    });

    return `You have ${type === 1 ? 'followed' : 'unfollowed'} the user successfully`;
  }
}
