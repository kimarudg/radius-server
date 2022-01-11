import { Module } from '@nestjs/common';
import { DgramModule } from '../dgram/dgram.module';
import { ProcessService } from './services/process/process.service';
import { ActivityService } from './services/activity/activity.service';

@Module({
  imports: [DgramModule.forRoot({ address: '0.0.0.0', port: 1812 })],
  providers: [ProcessService, ActivityService],
  exports: [ProcessService],
})
export class ProcessModule {}
