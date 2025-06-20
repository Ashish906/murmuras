import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/auth/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MurmursModule } from './modules/murmurs/murmurs.module';
import { Murmur } from './modules/murmurs/entities/murmur.entity';
import { MurmurLikeHistory } from './modules/murmurs/entities/murmur-likes-history.entity';
import { FollowingHistory } from './modules/users/entities/following-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env'
      }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        User,
        Murmur,
        MurmurLikeHistory,
        FollowingHistory
      ],
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      User, 
      Murmur, 
      MurmurLikeHistory, 
      FollowingHistory
    ]),
    AuthModule,
    UsersModule,
    MurmursModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
