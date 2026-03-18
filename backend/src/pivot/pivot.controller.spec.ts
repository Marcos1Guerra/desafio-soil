import { Test, TestingModule } from '@nestjs/testing';
import { PivotController } from './pivot.controller';
import { PivotService } from './pivot.service';

describe('PivotController', () => {
  let controller: PivotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PivotController],
      providers: [PivotService],
    }).compile();

    controller = module.get<PivotController>(PivotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
