
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
import { Rating } from './rating.entity';
  
  
  @Entity({
    name: 'Menu',
    orderBy: {
      createdAt: 'ASC',
    },
  })
  export class Menu {
    @ObjectIdColumn()
    _id: ObjectID;
    @Column()
    updatedAt: Date = null;
    @Column()
    name: string ;
    @Column()
    contenu: string ;
    @Column()
    description: string ;
    @OneToMany(() => Rating, rating => rating.menu)
  ratings: Rating[];
  
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date = null;
    @OneToMany(() => Product, product => product.menu)
    products: Product[];
    constructor(menu: Partial<Menu>) {
      Object.assign(this, menu);
    }
  }
  