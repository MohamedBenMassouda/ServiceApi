import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryLog } from './query-log.entity';

@Injectable()
export class QueryLogService {
  constructor(
    @InjectRepository(QueryLog)
    private readonly repo: Repository<QueryLog>,
  ) {}

  log(resolverName: string) {
    return this.repo.save(this.repo.create({ resolverName }));
  }
}
