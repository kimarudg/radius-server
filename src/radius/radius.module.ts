import { Module } from '@nestjs/common';
import { RadiusService } from './services/radius/radius.service';

@Module({
  providers: [RadiusService]
})
export class RadiusModule {}
