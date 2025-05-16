import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';

@Module({
  providers: [ReseniaService]
})
export class ReseniaModule {}
