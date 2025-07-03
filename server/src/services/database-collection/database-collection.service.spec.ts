import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseCollectionService } from './database-collection.service';

describe('DatabaseCollectionService', () => {
  let service: DatabaseCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseCollectionService],
    }).compile();

    service = module.get<DatabaseCollectionService>(DatabaseCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
