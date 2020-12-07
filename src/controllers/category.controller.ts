/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller } from '@nestjs/common';
import { Category } from '../models/category.entity';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoryService } from 'src/services/category.service';

@Controller('Category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('getCategories')
  async getCategories() {
    const categories= await this.categoryService.getCategories()
    console.log("ggggggggg")
    console.log(categories);
    return categories;
  }

  @MessagePattern('getCategoryById')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getCategoryById(
    @Payload() id: any,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return  await this.categoryService.getCategoryById(id)
  }
  

  @MessagePattern('createCategory')
  async createCategory(
    @Payload() input: Partial<Category>,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.categoryService.createCategory(input)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('updateCategory')
  async updateEvent(@Payload() id:any,@Payload() category: Partial<Category>): Promise<Category> {
    return await this.categoryService.updateCategory(id,category)
  }

  @MessagePattern('deleteCategory')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteCategory(@Payload() id: any): Promise<boolean> {
    return this.categoryService.deleteCategory(id)
  }

  
}
