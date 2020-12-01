import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('main');

async function bootstrap() {

  try {
    const microserviceOptions = {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://taktak:taktak@127.0.0.1:5672/taktakProduct'],
        queue: 'taktakProduct',
        noAck: true,
        queueOptions: {
          durable: true
        },
      },
    }  
  
    const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);  
    app.listen(() => logger.log('shopium Microservice is listening'));
  } catch (error) {
    console.log(error)
  }
  
}
bootstrap().catch(e => console.log(e));