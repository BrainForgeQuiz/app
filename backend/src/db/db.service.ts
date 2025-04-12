import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Client } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client = new Client({
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT || 5432),
  });

  public db = drizzle(this.client, { schema });

  async onModuleInit() {
    await this.db.$client.connect();
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
