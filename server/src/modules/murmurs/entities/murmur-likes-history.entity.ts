import { User } from "src/modules/auth/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ForeignKey, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Murmur } from "./murmur.entity";

@Entity({
  name: 'murmur_likes_history'
})
export class MurmurLikeHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    murmurId: number;

    @ForeignKey(() => User)
    @Column({ type: 'int', nullable: false })
    userId: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Murmur)
    murmur: Murmur;
}
