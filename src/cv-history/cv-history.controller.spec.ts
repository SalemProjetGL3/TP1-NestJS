import { Test, TestingModule } from '@nestjs/testing';
import { CvHistoryController } from './cv-history.controller';

describe('CvHistoryController', () => {
  let controller: CvHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvHistoryController],
    }).compile();

    controller = module.get<CvHistoryController>(CvHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
