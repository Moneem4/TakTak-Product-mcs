
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
import { Product } from './product.entity';
import { of } from 'rxjs';
  
  
  @Entity({
    name: 'Rating',
    orderBy: {
      createdAt: 'ASC',
    },
  })
  export class Rating {
    @ObjectIdColumn()
    _id: ObjectID;
  
    @ObjectIdColumn()
    userId: ObjectID;
    @Column()
    updatedAt: Date = null;
    
   @Column()
   name: string; 
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
    @ManyToOne(() => Offer, offer => offer.ratings, {

        nullable: false,
        cascade: ["remove", "update"]
      }) offer: Offer;
    @ManyToOne(() => Product, product => product.ratings, {

        nullable: false,
        cascade: ["remove", "update"]
      }) product: Product;
    @ManyToOne(() => Category, category => category.products, {

        nullable: false,
        cascade: ["remove", "update"]
      }) category: Category;
      @OneToMany(() => Offer, offer => offer.product)
	offers: Offer[];
    constructor(rating: Partial<Rating>) {
      Object.assign(this, rating);
    }
  }
  