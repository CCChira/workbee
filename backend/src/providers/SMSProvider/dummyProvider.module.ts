import { Module } from '@nestjs/common';
import { DummyProvider } from './dummyProvider.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DummyProvider],
})
export class DummyModule {}
