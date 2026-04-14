import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Author } from './author.entity';

@Entity('reviews')
@Index(['productId'])
@Index(['authorId'])
@Index(['notation'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notation: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column('text')
  comment: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product?: Product;

  @Column()
  productId: number;

  @ManyToOne(() => Author, (author) => author.reviews, {
    onDelete: 'CASCADE',
  })
  author?: Author;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;
}
