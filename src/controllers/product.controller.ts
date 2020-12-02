/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller,Logger } from '@nestjs/common';
import {MessagePattern,Payload,Ctx,RmqContext,} from '@nestjs/microservices';
import { Product } from 'src/models/product.entity';
import { ProductService } from 'src/services/product.service';


@Controller('Product')
export class ProductController {
  private logger = new Logger('Product Controller');
  constructor(
     private readonly productService:ProductService,
    
  ) {}
  @MessagePattern('getProducts')
  async getProducts() {
    return await this.productService.getProducts()
  }

  @MessagePattern('getProductById')
  async getProductById(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
   return await this.productService.getProductById(data)
  }
  //getProductByProduct
  @MessagePattern('getProductByCategory')
  async getProductByCategory( @Payload() data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
   return this.productService.getProductByCategory(data)
  }
  //CreateProduct
  @MessagePattern('createProduct')
  async createProduct(@Payload() product: Partial<Product>,@Ctx() context: RmqContext,): Promise<Product> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return this.productService.createProduct(product)
  }
//updateProduct
  @MessagePattern('updateProduct')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateProduct(@Payload() product: Partial<Product>): Promise<Product> {
   return this.productService.updateProduct(product)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('deleteProduct')
  async deleteProduct(@Payload() id: any): Promise<boolean> {
    return this.productService.deleteProduct(id)
  }

  
}
