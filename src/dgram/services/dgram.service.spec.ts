import { Test, TestingModule } from '@nestjs/testing';
import { DgramService } from './dgram.service';

describe('DgramService', () => {
  let service: DgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DgramService],
    }).compile();

    service = module.get<DgramService>(DgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
