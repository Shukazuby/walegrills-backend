import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronWork } from './cron';

@Module({
  imports:[
  ],
  providers: [CronWork],
  exports: [CronWork]
})
export class CronWorkModule {}
