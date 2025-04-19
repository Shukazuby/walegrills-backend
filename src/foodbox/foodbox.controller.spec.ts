import { Test, TestingModule } from '@nestjs/testing';
import { FoodboxController } from './foodbox.controller';
import { FoodboxService } from './foodbox.service';

describe('FoodboxController', () => {
  let controller: FoodboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodboxController],
      providers: [FoodboxService],
    }).compile();

    controller = module.get<FoodboxController>(FoodboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
