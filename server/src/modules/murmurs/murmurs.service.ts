import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { UpdateMurmurDto } from './dto/update-murmur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Murmur } from './entities/murmur.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { MurmurLikeHistory } from './entities/murmur-likes-history.entity';

@Injectable()
export class MurmursService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Murmur)
    private readonly murmurRepository: Repository<Murmur>
  ) {}

  async create(body: CreateMurmurDto, user: any) {
    const murmur = await this.murmurRepository.save({
      text: body.text,
      owner_id: user.id
    });

    return murmur;
  }

  async like(murmurId: number, type: number, user: any) {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId, owner_id: Not(user.id) }
    });
    if(!murmur) {
      throw new BadRequestException('Murmur cannot be liked');
    }

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      let counter = 1;
      if(type === 1) {
        await transactionalEntityManager.save(MurmurLikeHistory, {
          murmur_id: murmurId,
          user_id: user.id
        });
      } else {
        // Unlike
        await transactionalEntityManager.softDelete(MurmurLikeHistory, {
          murmur_id: murmurId,
          user_id: user.id
        });
        counter = -1;
      }
      await transactionalEntityManager.increment(Murmur, { id: murmurId }, 'likes_count', counter);
    });

    return `You have ${type === 1 ? 'liked' : 'unliked'} the murmur successfully`;
  }

  async getUserMurmurs(userId: number) {
    const murmurs = await this.murmurRepository.find({
      where: { owner_id: userId },
      order: { created_at: 'DESC' }
    });

    return murmurs;
  }

  async getMurmurTimeline(query: PaginationDto, user: any) {
    return await this.murmurRepository.find({
      relations: ['owner'],
      where: { owner_id: Not(user.id) },
      order: { created_at: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }

  async remove(id: number, user: any) {
    const { affected } = await this.murmurRepository.softDelete({
      id: id,
      owner_id: user.id
    });
    if(!affected) {
      throw new BadRequestException('Murmur cannot be deleted');
    }

    return 'Murmur deleted successfully';
  }
}
