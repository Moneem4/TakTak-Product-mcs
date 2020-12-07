/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import {Payload} from '@nestjs/microservices';
import { Product } from 'src/models/product.entity';
import { Category } from 'src/models/category.entity';

@Injectable()
export class ProductService {
 
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
  ) {}
  
  async getProducts() {
    return await this.productRepository.find({ where: { deletedAt: null } });
  }

  
  async getProductById(@Payload() data: any) {
    const product = await this.productRepository.findOne(data);
    if (product.deletedAt == null) {
      return product;
    } else {
      return null;
    }
  }
  //getProductByProduct

  async getProductByCategory( @Payload() data: string) {
    
    const products = await this.productRepository.find({
      where: { category: data },
    });
    return products;
  }
  //CreateProduct
  
  async createProduct(@Payload() product: Partial<Product>): Promise<Product> {
   
    product.category = new ObjectID(product.category);
    const categoryT = await this.categoryRepository.findOne(product.category, {relations:['products']} );
   
    if (categoryT) {
      if (
        !product ||
        !product.name ||
        !product.price ||
        !product.category 
        ||!product.quantity) 
        {
        console.log(`data is missing can't create Product`);
      }
      product.category = categoryT;
      const newProduct =  await this.productRepository.save(product);
      return newProduct;
    } else {
      console.log(categoryT);
    }
  }
//updateProduct
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateProduct(@Payload() product: Partial<Product>): Promise<Product> {
    console.log(product);
    const _id = product._id;
    delete product._id;
    product.updatedAt = new Date(Date.now());
    const updated = await this.productRepository.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: product },
      { returnOriginal: false },
    );

    return new Product(updated.value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteProduct(@Payload() id: any): Promise<boolean> {
    const idProduct = ObjectID(id);
    const Product = await this.productRepository.findOne(
      idProduct,
    );
    console.log(Product);
    const _id = Product._id;
    if (!Product) {
      return false;
    } else {
      delete Product._id;
      await this.productRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { deletedAt: new Date(Date.now()) } },
        { returnOriginal: false },
      );
      return true;
    }
  }

 
}
