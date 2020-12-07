import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Menu } from '../models/Menu.entity';
import { Payload} from '@nestjs/microservices';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: MongoRepository<Menu>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getMenus() {
    return await this.menuRepository.find({ where: { deletedAt: null } });
  }

  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getMenuById(
    @Payload() id: any, 
  ): Promise<Menu> {

    return  await this.menuRepository.findOne(id, { relations: ['products'] });
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 
  
  async createMenu(
    @Payload() input: Partial<Menu>,
    
  ): Promise<Menu> {
    
    console.log('here', input);
    if (
      !input ||
      !input.description ||
      !input.name ) {
      console.log(`data is missing can't create Menu`);
    }
    
    const menu = await this.menuRepository.save(new Menu(input));
    return menu;
  }

  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateMenu( id: string,menuU: Partial<Menu>): Promise<Menu> {
   // console.log(id);
    const menu = await this.menuRepository.findOne(id);
    console.log(menu._id);
    delete menu._id;

    menu.updatedAt = new Date(Date.now());
    const _id=menu._id
    const updated = await this.menuRepository.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: menuU },
      { returnOriginal: false },
    );

    return new Menu(updated.value);
  }

 
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteMenu(@Payload() id: any): Promise<boolean> {
    const idMenu = ObjectID(id);
    console.log(idMenu);
    const menu = await this.menuRepository.findOne(idMenu);
    console.log(menu);
    const _id = menu._id;
    if (!menu) {
      return false;
    } else {
      delete menu._id;
      await this.menuRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { deletedAt: new Date(Date.now()) } },
        { returnOriginal: false },
      );
      return true;
    }
  }

  
 
}
