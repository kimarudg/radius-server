/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityService {
  // public pubSub: PubSub;
  constructor() {}

  async create(data) {}

  async find() {}

  async findLastConnectedClients() {
    // tslint:disable-next-line:max-line-length
    const selectLastConnectionsQuery = `SELECT *, CONCAT(\`address\`,':',\`port\`) AS 'client' FROM activity WHERE \`from\`='CLIENT' GROUP BY client ORDER BY createdAt DESC LIMIT 10`;
  }
}
