import { Body, Controller, Post, UseFilters, HttpStatus } from '@nestjs/common';
import {BuymaService} from './buyma.service';
import { ShopifyRequstDto } from './dto/shopify.request.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('buyma')
@UseFilters(new HttpExceptionFilter()) // 예외 필터 적용
export class BuymaController {
    constructor(private readonly buymaService : BuymaService){};

    @Post('overwrite')
    async createBuyma(@Body() body: ShopifyRequstDto) {
        try {
            const result = await this.buymaService.createBuymaOverwrite(body);
            // 결과를 클라이언트에 반환합니다.
            return {
                statusCode: HttpStatus.OK,
                message: '성공적으로 처리되었습니다.',
                data: result
            };
        } catch (error) {
            // 에러 처리는 예외 필터에서 자동으로 수행됩니다.
            throw error;
        }
    }
}
