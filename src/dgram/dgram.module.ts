import { createDgramProviders } from './dgram.providers';
import { DynamicModule, Module } from '@nestjs/common';
import { BindOptions, SocketOptions } from 'dgram';
import { DgramService } from './services/dgram.service';

@Module({
  providers: [DgramService],
  exports: [DgramService],
})
export class DgramModule {
  static forRoot(
    bindOptions: BindOptions = { address: '127.0.0.1', port: 1812 },
    socketOptions: SocketOptions = { type: 'udp4' },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMessage: () => void = () => {},
  ): DynamicModule {
    const providers = createDgramProviders(
      bindOptions,
      socketOptions,
      onMessage,
    );
    return {
      module: DgramModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
