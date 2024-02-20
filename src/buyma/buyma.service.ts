import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BuymaShopify } from './helper/buyma.shopify';
import { ShopifyRequstDto } from './dto/shopify.request.dto';
import { BuymaOverwrite } from './helper/buyma.overwrite';
import { ShopifyImageDownload } from './helper/shopify.imageDownload';

@Injectable()
export class BuymaService {

    constructor(
        private readonly buymaShopify: BuymaShopify, 
        private readonly buymaOverwrite: BuymaOverwrite, 
        private readonly shopifyImageDownload: ShopifyImageDownload
    ) {};

    async createBuymaOverwrite(shopifyRequstBody: ShopifyRequstDto) {
        const shopifyDataArray = await this.buymaShopify.getShopifyData(shopifyRequstBody);
        const processedProducts = []; // 처리된 제품들의 정보를 저장할 배열

        try {
            for (const shopifyObject of shopifyDataArray) {
                // 이미지 다운로드
                await this.shopifyImageDownload.downloadImages(shopifyObject.title, shopifyObject.images.map(imageObject => imageObject.src));
                // Buyma에 제품 생성
                await this.buymaOverwrite.createProduct(shopifyRequstBody.buymaID, shopifyRequstBody.buymaPW, shopifyObject);
                // 성공적으로 처리된 제품의 정보를 배열에 추가
                processedProducts.push({
                    title: shopifyObject.title,
                    status: 'Processed successfully'
                });
                // 이미지 삭제
                await this.shopifyImageDownload.deleteAllImages(shopifyObject.title);
            }

            // 모든 제품이 성공적으로 처리되었을 때의 반환 값
            return {
                message: '모든 제품이 성공적으로 BUYMA에 등록되었습니다.',
                products: processedProducts
            };

        } catch (error) {
            if (error.response.status == HttpStatus.BAD_REQUEST) {
                // 이미 HttpException으로 던져진 에러인 경우
                throw error;
            } else {
                // 일반 에러인 경우, 사용자 정의 에러로 전환
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'BUYMA 작성 중 예기치 않은 오류가 발생했습니다.',
                    detail: error.message
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
