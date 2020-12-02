/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import {Payload} from '@nestjs/microservices';
import { Rating } from 'src/models/rating.entity';
import { Offer } from 'src/models/offer.entity';
import { Menu} from 'src/models/menu.entity';
import { Product } from 'src/models/product.entity';


@Injectable()
export class RatingService {
 
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: MongoRepository<Rating>,
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(Offer)
    private readonly offerRepository: MongoRepository<Offer>,
    @InjectRepository(Menu)
    private readonly menuRepository: MongoRepository<Menu>,
  ) {}
  
  async getRatings() {
    return await this.ratingRepository.find({ where: { deletedAt: null } });
  }

  
  async getRatingById(@Payload() data: any) {
    const rating = await this.ratingRepository.findOne(data);
    if (rating.deletedAt == null) {
      return rating;
    } else {
      return null;
    }
  }
  //getRatingByCategory

  async getRatingByCategory( @Payload() data: string) {
    
    const ratings = await this.ratingRepository.find({
      where: { category: data },
    });
    return ratings;
  }
  //CreateRating
  
  async createRating(@Payload() rating: Partial<Rating>): Promise<Rating> {
    rating.menu= new ObjectID(rating.menu)
    rating.offer= new ObjectID(rating.offer)
    rating.product= new ObjectID(rating.product)
    //const categoryT = await this.categoryRepository.findOne(rating.category, {relations:['ratings']} );
    const productT = await this.productRepository.findOne(rating.product);
    const offerT = await this.offerRepository.findOne(rating.offer);
    const menuT = await this.menuRepository.findOne(rating.menu);
    
      if (
        !rating ||
        !rating.name ||
        !rating.userId ||
        !rating.name ||
        !rating.product ||
        !rating.offer )
        
        {
        console.log(`data is missing can't create rating`);
      }
     
      rating.product=productT;
      rating.offer=offerT;
      rating.menu=menuT ;
      const newRating =  await this.ratingRepository.save(rating);
      return newRating;
  }
//updateRating
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateRating(@Payload() rating: Partial<Rating>): Promise<Rating> {
    console.log(rating);
    const _id = rating._id;
    delete rating._id;
    rating.updatedAt = new Date(Date.now());
    const updated = await this.ratingRepository.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: rating },
      { returnOriginal: false },
    );

    return new Rating(updated.value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteRating(@Payload() id: any): Promise<boolean> {
    const idRating = ObjectID(id);
    const rating = await this.ratingRepository.findOne(
      idRating,
    );
    console.log(rating);
    const _id = rating._id;
    if (!rating) {
      return false;
    } else {
      delete rating._id;
      await this.ratingRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { deletedAt: new Date(Date.now()) } },
        { returnOriginal: false },
      );
      return true;
    }
  }

 
}
