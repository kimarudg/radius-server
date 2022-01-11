import { ProcessModule } from './process/process.module';
import { DgramService } from './dgram/services/dgram.service';
import { DatabaseModule } from './database/database.module';
import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DgramModule } from './dgram/dgram.module';
import { ProcessService } from './process/services/process/process.service';
import { RadiusModule } from './radius/radius.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    DgramModule.forRoot({ address: '0.0.0.0', port: 1812 }),
    ProcessModule,
    RadiusModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly dgramService: DgramService,
    private readonly processService: ProcessService,
  ) {}

  configure() {
    const dgramSocketServer = this.dgramService.createDgramSocket();
    this.processService.onMessage(dgramSocketServer);
  }
}
