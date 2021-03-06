import { Body, Controller } from '@nestjs/common';


import { Menu } from '../models/Menu.entity';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MenuService } from 'src/services/menu.service';

@Controller('Menu')
export class MenuController {
  constructor(
    
    private readonly menuService: MenuService,
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('getMenus')
  async getCategories() {
    return await this.menuService.getMenus()
  }

  @MessagePattern('getMenuById')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getMenuById(
    @Payload() id: any,
    @Ctx() context: RmqContext,
  ): Promise<Menu> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
    return  await this.menuService.getMenuById(id)
  }
 

  @MessagePattern('createMenu')
  async createMenu(
    @Payload() input: Partial<Menu>,
    @Ctx() context: RmqContext,
  ): Promise<Menu> {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    channel.ack(orginalMessage);
   return this.menuService.createMenu(input)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @MessagePattern('updateMenu')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateEvent(@Payload() id: string,menuU: Partial<Menu>): Promise<Menu> {
    return this.menuService.updateMenu(id,menuU)
  }

  @MessagePattern('deleteMenu')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteMenu(@Payload() id: any): Promise<boolean> {
   return this.menuService.deleteMenu(id)
    }

}
