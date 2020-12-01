import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Category } from '../models/category.entity';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getCategories() {
    return await this.categoryRepository.find({ where: { deletedAt: null } });
  }

 
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getCategoryById(@Payload() id: any): Promise<Category> {
    
    return  await this.categoryRepository.findOne(id, { relations: ['closes'] });
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async createCategory(@Payload() input: Partial<Category>,
  ): Promise<Category> {
    
    console.log('here', input);
    if (
      !input ||
      !input.description ||
      !input.name ||
      !input.resource ) {
      console.log(`data is missing can't create Category`);
    }
  
    const category = await this.categoryRepository.save(new Category(input));
    return category;
  }

 
 
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateCategory(id:any, categoryT: Partial<Category>): Promise<Category> {
    console.log(categoryT);
    const category = await this.categoryRepository.findOne(id);
    delete category._id;
    category.updatedAt = new Date(Date.now());
    const _id=new ObjectID(category._id)
    const updated = await this.categoryRepository.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: categoryT },
      { returnOriginal: false },
    );

    return new Category(updated.value);
  }

 
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteCategory(@Payload() id: any): Promise<boolean> {
    const idCategory = ObjectID(id);
    console.log(idCategory);
    const Category = await this.categoryRepository.findOne(idCategory);
    console.log(Category);
    const _id = Category._id;
    if (!Category) {
      return false;
    } else {
      delete Category._id;
      await this.categoryRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { deletedAt: new Date(Date.now()) } },
        { returnOriginal: false },
      );
      return true;
    }
  }

 
}
