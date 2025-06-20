import { Module } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { MurmursController } from './murmurs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Murmur } from './entities/murmur.entity';
import { MurmurLikeHistory } from './entities/murmur-likes-history.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Murmur,
      MurmurLikeHistory,
      User
    ])
  ],
  controllers: [MurmursController],
  providers: [MurmursService],
})
export class MurmursModule {}
