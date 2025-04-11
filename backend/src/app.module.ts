import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './db/db.service';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
