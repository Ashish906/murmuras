import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
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

  async getAllUsers(user: any) {
    const meFollowing = await this.followingHistoryRepository.find({
      select: ['following'],
      where: { follower: user.id }
    });
    const followingObj = meFollowing.reduce((acc, cur) => {
      acc[cur.following] = true;
      return acc;
    }, {});

    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'followers_count', 'following_count'],
      where: { is_active: true, id: Not(user.id) }
    });

    users.forEach((user) => {
      (<any>user).is_following = !!followingObj[user.id];
    });

    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'followers_count', 'following_count'],
      where: { id: userId, is_active: true }
    });
    const meFollowing = await this.followingHistoryRepository.findOne({
      select: ['id'],
      where: { follower: user.id, following: userId }
    });
    if(meFollowing) {
      (<any>user).is_following = true;
    }

    return user;
  }

  async followUser(userId: number, type: number, user: any) {
    const followerId = user.id;
    
    const message = await this.validateFollowing(userId, followerId, type);
    if(message) {
      return message;
    }

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

  async validateFollowing(userId: number, followerId: number, type: number) {
    if(userId === followerId) {
      return 'You cannot follow yourself';
    }
    if(type === 1) {
      const existingFollowingHistory = await this.followingHistoryRepository.findOne({
        select: ['id'],
        where: { follower: followerId, following: userId }
      });
      if(existingFollowingHistory) {
        return 'You are already following this user';
      }
    }
  }
}
