/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import {Offer} from 'src/models/offer.entity';
import {Payload} from '@nestjs/microservices';
import { Product } from 'src/models/product.entity';
@Injectable()
export class OfferService {

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: MongoRepository<Offer>,
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
  ) {}

  
  async getOfferById(@Payload() data: any) {
    
    const offer = await this.offerRepository.findOne(data);
    if (offer.deletedAt == null) {
      return offer;
    } else {
      return null;
    }
  }
  //getOfferByOffer
  
  async getOffers( @Payload() data: string) {
    const offers = await this.offerRepository.find();
    return offers;
  }

  
  //CreateOffer
 
  async createOffer(@Payload() offer: Partial<Offer>): Promise<Offer> {
    
    offer.product = new ObjectID(offer.product);
    console.log(offer.product);
    const productT = await this.productRepository.findOne(offer.product);
    if (productT) {
      if (
        !offer ||
        !offer.expirationDate ||
        !offer.startDate ||
        !offer.quantity  ||
        !offer.percentage  ||
        !offer.state
      ) {
        console.log(`data is missing can't create Offer`);
      }
      offer.product = productT;
      const newOffer =  await this.offerRepository.save(offer);
      return newOffer;
    } else {
      console.log(productT);
    }
  }
//updateOffer
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateOffer(@Payload() offer: Partial<Offer>): Promise<Offer> {
    console.log(offer);
    const _id = offer._id;
    delete offer._id;
    offer.updatedAt = new Date(Date.now());
    const updated = await this.offerRepository.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: offer },
      { returnOriginal: false },
    );

    return new Offer(updated.value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 
  async deleteOffer(@Payload() id: any): Promise<boolean> {
    const idOffer = ObjectID(id);
    const offer = await this.offerRepository.findOne(idOffer);
    console.log(Offer);
    const _id = offer._id;
   
     if (!offer) {
      return false;
    } else {
      delete offer._id;
      await this.offerRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { deletedAt: new Date(Date.now()) } },
        { returnOriginal: false },
      );
      return true;
    }
  }

}
 