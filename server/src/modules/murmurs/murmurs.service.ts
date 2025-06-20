import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Murmur } from './entities/murmur.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { MurmurLikeHistory } from './entities/murmur-likes-history.entity';
import { FollowingHistory } from '../users/entities/following-history.entity';

@Injectable()
export class MurmursService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Murmur)
    private readonly murmurRepository: Repository<Murmur>,
    @InjectRepository(MurmurLikeHistory)
    private readonly murmurLikeHistoryRepository: Repository<MurmurLikeHistory>,
    @InjectRepository(FollowingHistory)
    private readonly followingHistoryRepository: Repository<FollowingHistory>
  ) {}

  async create(body: CreateMurmurDto, user: any) {
    const murmur = await this.murmurRepository.save({
      text: body.text,
      userId: user.id
    });

    return murmur;
  }

  async like(murmurId: number, type: number, user: any) {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId, userId: Not(user.id) }
    });
    if(!murmur) {
      throw new BadRequestException('Murmur cannot be liked');
    }

    if(type === 1) {
      const existingLikeHistory = await this.murmurLikeHistoryRepository.findOne({
        select: ['id'],
        where: { murmurId: murmurId, userId: user.id }
      });
      if(existingLikeHistory) {
        return 'You are already liked this murmur';
      }
    }

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      let counter = 1;
      if(type === 1) {
        await transactionalEntityManager.save(MurmurLikeHistory, {
          murmurId,
          userId: user.id
        });
      } else {
        // Unlike
        await transactionalEntityManager.softDelete(MurmurLikeHistory, {
          murmurId: murmurId,
          userId: user.id
        });
        counter = -1;
      }
      await transactionalEntityManager.increment(Murmur, { id: murmurId }, 'likes_count', counter);
    });

    return `You have ${type === 1 ? 'liked' : 'unliked'} the murmur successfully`;
  }

  async getUserMurmurs(userId: number, user: any) {
    const myLikedMurmurs = await this.murmurLikeHistoryRepository.find({
      relations: ['murmur'],
      where: { 
        userId: user.id, 
        murmur: {
          userId
        }
      }
    });
    const likedObj = myLikedMurmurs.reduce((acc, cur) => {
      acc[cur.murmur.id] = true;
      return acc;
    }, {});

    const murmurs = await this.murmurRepository.find({
      relations: ['user'],
      where: { userId: userId },
      order: { created_at: 'DESC' }
    });

    return murmurs.map((murmur) => {
      (<any>murmur).is_liked = !!likedObj[murmur.id];
      delete murmur?.user?.password;
      return murmur;
    });
  }

  async getMurmurTimeline(query: PaginationDto, user: any) {
    const myLikedMurmurs = await this.murmurLikeHistoryRepository.find({
      where: { userId: user.id },
    });

    const myFollowing = await this.followingHistoryRepository.find({
      where: { follower: user.id }
    });
    const followingIds = myFollowing.map((following) => following.following);

    const likedObj = myLikedMurmurs.reduce((acc, cur) => {
      acc[cur.murmurId] = true;
      return acc;
    }, {});

    const [murmurs, total] = await this.murmurRepository.findAndCount({
      relations: ['user'],
      where: { userId: In(followingIds) },
      order: { created_at: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return {
      data: murmurs.map((murmur) => {
        (<any>murmur).is_liked = !!likedObj[murmur.id];
        delete murmur?.user?.password;
        return murmur;
      }),
      total
    }
  }

  async remove(id: number, user: any) {
    const { affected } = await this.murmurRepository.softDelete({
      id: id,
      userId: user.id
    });
    if(!affected) {
      throw new BadRequestException('Murmur cannot be deleted');
    }

    return 'Murmur deleted successfully';
  }
}
