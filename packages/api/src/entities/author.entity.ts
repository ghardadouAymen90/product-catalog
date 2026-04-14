import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('authors')
@Index(['type'])
@Index(['createdAt'])
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'user' })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Review, (review) => review.author, { cascade: true })
  reviews: Review[];
}
