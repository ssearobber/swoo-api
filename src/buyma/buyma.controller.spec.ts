import { Test, TestingModule } from '@nestjs/testing';
import { BuymaController } from './buyma.controller';

describe('BuymaController', () => {
  let controller: BuymaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuymaController],
    }).compile();

    controller = module.get<BuymaController>(BuymaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
