/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller,Logger } from '@nestjs/common';
import {MessagePattern,Payload,Ctx,RmqContext,} from '@nestjs/microservices';
import { Rating } from 'src/models/Rating.entity';
import { RatingService } from 'src/services/rating.service';


@Controller('Rating')
export class RatingController {
  private logger = new Logger('Rating Controller');
  constructor(
    private readonly ratingService:RatingService,
    
  ) {}
  @MessagePattern('getRatings')
  async getRatings() {
    return await this.ratingService.getRatings()
  }

  @MessagePattern('getRatingById')
  async getRatingById(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
   return await this.ratingService.getRatingById(data)
  }
  //getRatingByRating
  @MessagePattern('getRatingByCategory')
  async getRatingByCategory( @Payload() data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
   return this.ratingService.getRatingByCategory(data)
  }
  //CreateRating
  @MessagePattern('createRating')
  async createRating(@Payload() Rating: Partial<Rating>,@Ctx() context: RmqContext,): Promise<Rating> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.ratingService.createRating(Rating)
  }
//updateRating
  @MessagePattern('updateRating')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateRating(@Payload() Rating: Partial<Rating>): Promise<Rating> {
   return this.ratingService.updateRating(Rating)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('deleteRating')
  async deleteRating(@Payload() id: any): Promise<boolean> {
    return this.ratingService.deleteRating(id)
  }

  
}
