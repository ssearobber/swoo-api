import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from 'rxjs';
import { ShopifyRequstDto } from "../dto/shopify.request.dto";

@Injectable()
export class BuymaShopify {

    constructor(private readonly httpService: HttpService) {}

    async getShopifyData(shopifyRequstBody: ShopifyRequstDto) {
        const headersRequest = {
            'X-Shopify-Access-Token': shopifyRequstBody.shopifyAccessToken,
        };
        let productString = shopifyRequstBody.shopifyProductArray.join(",");
        try {
            const response = await firstValueFrom(this.httpService.get(`https://1acspaces.jp/admin/api/2023-10/products.json?ids=${productString}`, { headers: headersRequest }));
            return response.data.products;
        } catch (error) {
            console.error(error);
        }
    }
}