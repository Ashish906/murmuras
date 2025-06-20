import { User } from 'src/modules/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ForeignKey } from 'typeorm';

@Entity({
    name: 'following_history'
})
export class FollowingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ForeignKey(() => User)
  @Column({ type: 'int', nullable: false })
  follower: number;

  @ForeignKey(() => User)
  @Column({ type: 'int', nullable: false })
  following: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
