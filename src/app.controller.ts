/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AppController {
  @EventPattern('message_printed')
  async handleMessagePrinted(data: Record<string, unknown>) {
    console.log(data.text);
  }
  @MessagePattern('ping')
  pingPostService() {
    Logger.log('ping contract service')
    return of('pong').pipe(delay(1000));
  }
}