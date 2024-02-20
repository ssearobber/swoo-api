import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuymaModule } from './buyma/buyma.module';

@Module({
  imports: [BuymaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
