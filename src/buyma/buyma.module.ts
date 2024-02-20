import { Module } from '@nestjs/common';
import { BuymaService } from './buyma.service';
import { BuymaController } from './buyma.controller';
import { BuymaShopify } from './helper/buyma.shopify';
import { HttpModule} from '@nestjs/axios';
import { BuymaOverwrite } from './helper/buyma.overwrite';
import { ShopifyImageDownload } from './helper/shopify.imageDownload';

@Module({
  imports:[HttpModule],
  controllers:[BuymaController],
  providers: [BuymaService, BuymaShopify, BuymaOverwrite, ShopifyImageDownload]
})
export class BuymaModule {}
