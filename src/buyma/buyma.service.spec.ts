import { Test, TestingModule } from '@nestjs/testing';
import { BuymaService } from './buyma.service';

describe('BuymaService', () => {
  let service: BuymaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuymaService],
    }).compile();

    service = module.get<BuymaService>(BuymaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
