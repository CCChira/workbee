import { Module } from '@nestjs/common';
import { TasktemplatesController } from './tasktemplates.controller';
import { TasktemplatesService } from './tasktemplates.service';

@Module({
  controllers: [TasktemplatesController],
  providers: [TasktemplatesService]
})
export class TasktemplatesModule {}
