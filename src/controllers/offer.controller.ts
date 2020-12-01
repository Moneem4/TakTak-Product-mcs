/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller } from '@nestjs/common';


import {Offer} from 'src/models/offer.entity';
import {MessagePattern,Payload,Ctx,RmqContext,} from '@nestjs/microservices';

import { OfferService } from 'src/services/offer.service';

@Controller('Offer')
export class OfferController {
  constructor(
   
    private readonly offerService: OfferService,
   
  ) {}

  @MessagePattern('getOfferById')
  async getOfferById(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.offerService.getOfferById(data)
  }
  //getOfferByOffer
  @MessagePattern('getOfferByProduct')
  async getOfferByProduct( @Payload() data: string, @Ctx() context: RmqContext,) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.offerService.getOfferByProduct(data)
  }
  //CreateOffer
  @MessagePattern('CreateOffer')
  async createOffer(@Payload() offer: Partial<Offer>,@Ctx() context: RmqContext,): Promise<Offer> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.offerService.createOffer(offer);
  }
//updateOffer
  @MessagePattern('updateOffer')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateOffer(@Payload() offer: Partial<Offer>): Promise<Offer> {
   return this.offerService.updateOffer(offer);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('deleteOffer')
  async deleteOffer(@Payload() id: any): Promise<boolean> {
   return this.offerService.deleteOffer(id);
  }

}
