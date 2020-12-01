
import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
  } from 'typeorm';
  import { ObjectID } from 'mongodb';
import { Offer } from './offer.entity';
import { Category } from './category.entity';
import { Menu } from './menu.entity';
  
  
  @Entity({
    name: 'Product',
    orderBy: {
      createdAt: 'ASC',
    },
  })
  export class Product {
    @ObjectIdColumn()
    _id: ObjectID;
  
    @ObjectIdColumn()
    ressource: ObjectID;
    @Column()
    updatedAt: Date = null;
    
  @Column()
  name: string;
  @Column()
  barCode: string;
   
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date = null;
    @ManyToOne(() => Menu, menu => menu.products, {

      nullable: false,
      cascade: ["remove", "update"]
    }) menu: Menu;
    @ManyToOne(() => Category, category => category.products, {

        nullable: false,
        cascade: ["remove", "update"]
      }) category: Category;
      @OneToMany(() => Offer, offer => offer.product)
	offers: Offer[];
    constructor(Product: Partial<Product>) {
      Object.assign(this, Product);
    }
  }
  