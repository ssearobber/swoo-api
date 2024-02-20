import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { writeFile, rm, readdir, mkdir } from 'fs/promises'
import { join } from 'path';

@Injectable()
export class ShopifyImageDownload {
  constructor(private httpService: HttpService) {}

  async downloadImages(title: string, imagePathArray: string[]) {
    const directoryPath = join(__dirname, `../../../tempSave/${title}`);
    
    // title 폴더 생성
    try {
      await mkdir(directoryPath, { recursive: true });
      console.log(`Directory ${title} created or already exists.`);
    } catch (error) {
      console.error(`Error creating directory ${title}: ${error}`);
      return; // 폴더 생성에 실패한 경우, 이미지 다운로드를 시도하지 않음
    }
    
    for (let index = 0; index < imagePathArray.length; index++) {
      const url = imagePathArray[index];
      try {
        // 정규 표현식을 사용하여 확장자 추출
        const extensionMatch = url.match(/(\.[0-9a-z]+)(?=[?#]|$)/i);
        const extension = extensionMatch ? extensionMatch[0] : '.jpg';

        const response = await firstValueFrom(
          this.httpService.get(url, { responseType: 'arraybuffer' }),
        );

        const filePath = join(directoryPath, `image${index + 1}${extension}`);
        await writeFile(filePath, response.data);

        console.log(`Downloaded and saved: ${title}/image${index + 1}${extension}`);
      } catch (error) {
        console.error(`Error downloading ${url}: ${error}`);
      }
    }
  }

  async deleteAllImages(title: string) {
    const directoryPath = join(__dirname, `../../../tempSave/${title}`);
    try {
      // 폴더 내용과 폴더 자체를 삭제
      await rm(directoryPath, { recursive: true, force: true });
      console.log(`Directory ${title} and all its contents have been deleted.`);
    } catch (error) {
      console.error(`Error deleting directory ${title}: ${error}`);
    }
  }
}