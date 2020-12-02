import {  Statetype } from 'src/schema/types.schema';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ObjectID } from 'mongodb';
import { Product } from './product.entity';
import { Rating } from './rating.entity';


@Entity({
  name: 'Offer',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class Offer {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  quantity: number;
  @Column()
  state: Statetype;
  @Column()
  description: string;
  @Column()
  percentage: number;
  @Column()
  updatedAt: Date = null;
  @Column()
  startDate: Date;
  @Column()
  expirationDate: Date;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date = null;
  @OneToMany(() => Rating, rating => rating.offer)
	ratings: Rating[];
  @ManyToOne(() => Product, product => product.offers, {
    nullable: false,
    cascade: ["remove", "update"]
  }) product: Product;
  constructor(offer: Partial<Offer>) {
    Object.assign(this, offer);
  }
}
