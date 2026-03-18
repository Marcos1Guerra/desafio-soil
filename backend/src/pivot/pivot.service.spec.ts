import { Test, TestingModule } from '@nestjs/testing';
import { PivotService } from './pivot.service';

describe('PivotService', () => {
  let service: PivotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PivotService],
    }).compile();

    service = module.get<PivotService>(PivotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
