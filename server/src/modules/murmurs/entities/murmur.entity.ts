import { User } from "src/modules/auth/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ForeignKey, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MurmurLikeHistory } from "./murmur-likes-history.entity";

@Entity({
  name: 'murmurs'
})
export class Murmur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    text: string;

    @Column({ type: 'int', default: 0 })
    likes_count: number;

    @ForeignKey(() => User)
    @Column({ type: 'int', nullable: false })
    owner_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User)
    owner: User;

    @OneToMany(() => MurmurLikeHistory, (murmurLikeHistory) => murmurLikeHistory.murmur, { onDelete: 'CASCADE' })
    likes: MurmurLikeHistory[];
}
