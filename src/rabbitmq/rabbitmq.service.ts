import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendMessage<T>(pattern: string, message: T) {
    return this.client.send(pattern, message).toPromise();
  }

  async emitEvent(pattern: string, message: any) {
    this.client.emit(pattern, message);
  }
}
