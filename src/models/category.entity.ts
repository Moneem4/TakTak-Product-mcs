
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { ObjectID } from 'mongodb';
import { Product } from './product.entity';


@Entity({
  name: 'Category',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class Category {
  @ObjectIdColumn()
  _id: ObjectID;

  @ObjectIdColumn()
  resource: ObjectID;
  @Column()
  updatedAt: Date = null;
  @Column()
  name: string ;
  @Column()
  description: string ;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date = null;
  @OneToMany(() => Product, product => product.category)
  products: Product[];
  constructor(category: Partial<Category>) {
    Object.assign(this, category);
  }
}
