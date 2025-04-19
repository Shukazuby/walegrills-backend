import { Test, TestingModule } from '@nestjs/testing';
import { FoodboxService } from './foodbox.service';

describe('FoodboxService', () => {
  let service: FoodboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodboxService],
    }).compile();

    service = module.get<FoodboxService>(FoodboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
