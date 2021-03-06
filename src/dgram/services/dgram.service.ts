import { DGRAM_SOCKET } from './../dgram.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'dgram';

@Injectable()
export class DgramService {
  public dgram: Socket;

  constructor(@Inject(DGRAM_SOCKET) private readonly dgramSocket: Socket) {}

  createDgramSocket() {
    console.log('Create dgram socket');
    this.dgram = this.dgramSocket;
    return this.dgram;
  }

  getDgramSocket() {
    return this.dgram;
  }

  root(): string {
    return 'Hello from DgramService !';
  }

  close() {
    console.log('dgram.service: close()');
    this.dgram.close();
  }

  // onModuleDestroy() {
  // 	close();
  // }
}
