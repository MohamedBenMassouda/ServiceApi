import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryLog } from './query-log.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(QueryLog)
    private readonly queryLogs: Repository<QueryLog>,
  ) {}

  async onModuleInit() {
    if ((await this.queryLogs.count()) > 0) return;
    await this.queryLogs.save([
      { resolverName: 'products' },
      { resolverName: 'orders' },
      { resolverName: 'products' },
      { resolverName: 'orderById' },
    ]);
    this.logger.log('Seeded 4 query log entries');
  }
}
