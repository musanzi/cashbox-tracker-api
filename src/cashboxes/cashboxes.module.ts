import { Module } from '@nestjs/common';
import { CashboxesService } from './cashboxes.service';
import { CashboxesController } from './cashboxes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cashbox } from './entities/cashbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cashbox])],
  controllers: [CashboxesController],
  providers: [CashboxesService],
  exports: [CashboxesService]
})
export class CashboxesModule {}
