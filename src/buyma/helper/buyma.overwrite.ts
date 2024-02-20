import puppeteer, { Browser, Page } from "puppeteer";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as cheerio from 'cheerio';
import { readdir } from 'fs/promises'
import { join } from 'path';


@Injectable()
export class BuymaOverwrite {
    async createProduct(buymaID, buymaPW, shopifyObject) {
        const id = buymaID;
        const password = buymaPW;
        let array1 = [];//색 나누기
        let array2 = [];//색 나누기
        let imagePathArray = []; // 이미지 path 격납
        let browser: Browser;
        let page: Page;
        try {
            browser = await puppeteer.launch({
            headless: true,
            args: [
                // '--window-size=1920,1180',
                // '--disable-notifications',
                // "--proxy-server=157.90.137.189:3128",
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
            // slowMo : 1 ,
            // userDataDir: path.join(__dirname, '../UserData') // 로그인 정보 쿠키 저장
            });
            page = await browser.newPage();
            // await page.setViewport({
            //     width: 1580,
            //     height: 980,
            // });
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://www.buyma.com/my/sell/new?tab=b');

            // 로그인 작업 건너뛰기
            if (await page.$('.user_name')) {
                console.log('이미 로그인 되어 있습니다.')
            } else {
                await page.evaluate((id,password) => {
                    const loginIdInput = document.querySelector('#txtLoginId') as HTMLInputElement;
                    const passwordInput = document.querySelector('#txtLoginPass') as HTMLInputElement;
                    const loginDo = document.querySelector('#login_do') as HTMLInputElement;
                    if (loginIdInput && passwordInput) {
                        loginIdInput.value = id;
                        passwordInput.value = password;
                        loginDo?.click();
                    }
                }, id,password);
                console.log('로그인했습니다.')
            }

            //(商品名)
            await page.waitForSelector('.bmm-c-field__input input.bmm-c-text-field');
            await page.type('.bmm-c-field__input input.bmm-c-text-field',shopifyObject.title);

            //(商品コメント)
            const body = shopifyObject.body_html;
            const $ = cheerio.load(body);
            const comment = $('body').text();
            const cleanedComment = comment.replace(/[^\w\s가-힣\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/gu, '');
            await page.waitForSelector('#comment textarea.bmm-c-textarea');
            await page.type('#comment textarea.bmm-c-textarea',cleanedComment);

            //(カテゴリ1)
            // const category1 = 'ライフスタイル';
            // await page.waitForSelector('.Select-control #react-select-2--value .Select-placeholder');
            // await page.click('.Select-control #react-select-2--value .Select-placeholder');
            // await new Promise(r => setTimeout(r, 5000));
            // await page.waitForSelector(`div[aria-label="${category1}"]`);
            // await page.click(`div[aria-label="${category1}"]`);

            //(カテゴリ2)
            // const category2 = '家具・日用品';
            // // await page.waitForSelector('#react-select-10--value');
            // // await page.click('#react-select-10--value .Select-placeholder');
            // await page.waitForSelector('#react-select-12--value');
            // await page.click('#react-select-12--value .Select-placeholder');
            // await page.waitForSelector(`div[aria-label="${category2}"]`);
            // await page.click(`div[aria-label="${category2}"]`);

            //(カテゴリ3)
            // const category3 = '机・テーブル';
            // // await page.waitForSelector('#react-select-11--value');
            // // await page.click('#react-select-11--value .Select-placeholder');
            // await page.waitForSelector('#react-select-13--value');
            // await page.click('#react-select-13--value .Select-placeholder');
            // await page.waitForSelector(`div[aria-label="${category3}"]`);
            // await page.click(`div[aria-label="${category3}"]`);

            //(ブランド)
            await page.waitForSelector('input[placeholder="ブランド名を入力すると候補が表示されます"]');
            if (shopifyObject.vendor) {
                await page.type('input[placeholder="ブランド名を入力すると候補が表示されます"]',shopifyObject.vendor);
            }
            await page.evaluate(() => { 
                const brandDo = document.querySelector('.bmm-c-checkbox .bmm-c-checkbox__input') as HTMLInputElement;
                brandDo?.click();
            });
            //(シーズン)

            //(テーマ)

            // //(色)
            // await page.waitForSelector('#react-select-5--value-item');
            // //색 나누기
            // array1 = array01(row.color);
            // for (let i = 0 ; i < array1.length ; i++) {
            //     if(array1[i]) {
            //         array2 = array02(array1[i]);
            //     //(色の系統) 클릭
            //     await page.click(`tbody tr:nth-child(${i+1}) td span div`);
            //     //(色の系統)
            //     await page.waitForSelector(`tbody tr:nth-child(${i+1}) .Select.is-open .Select-menu-outer .Select-menu div[aria-label="${array2[0]}"]`);
            //     await page.click(`tbody tr:nth-child(${i+1}) .Select.is-open .Select-menu-outer .Select-menu div[aria-label="${array2[0]}"]`);
            //     //(色名)
            //     await page.waitForSelector(`tbody tr:nth-child(${i+1}) td:nth-child(3) .bmm-c-text-field`);
            //     await page.type(`tbody tr:nth-child(${i+1}) td:nth-child(3) .bmm-c-text-field`,array2[1]);
            //     //(新しい色を追加)
            //     if(i < array1.length -1) await page.click('.bmm-c-form-table__foot a');
            //     }
            // }

            // add 2021/8/11 (ブランド) 브랜드 입력란 포커스를 벗어나기 위해 여기서 실행
            // if (shopifyObject.vendor) {
            //     await page.click('input[placeholder="ブランド名を入力すると候補が表示されます"]');
            //     // await page.waitForTimeout(2000);
            //     await new Promise(r => setTimeout(r, 2000));
            //     await page.waitForSelector('.bmm-c-suggest__main');
            //     await page.click('.bmm-c-suggest__main');
            // }

            // //(サイズ)
            // await page.waitForSelector('#react-tabs-2');
            // await page.click('#react-tabs-2');
            // await page.waitForSelector('#react-tabs-3 .Select-placeholder');
            // await page.click('#react-tabs-3 .Select-placeholder');
            // await page.waitForSelector(`div[aria-label="${row.size}"]`);
            // await page.click(`div[aria-label="${row.size}"]`);

            // //(販売可否/在庫)
            // await page.waitForSelector('.sell-amount-input input.bmm-c-text-field.bmm-c-text-field--half-size-char');
            // await page.type('.sell-amount-input input.bmm-c-text-field.bmm-c-text-field--half-size-char',row.inventory);
            

            //(配送方法) 정적으로 밑에서 1개만 체크 (kse체크예상)
            await page.evaluate(() => {
                const delivery = document.querySelector(".bmm-c-form-table__body .bmm-c-form-table__table tr:nth-child(9)") as HTMLInputElement;
                delivery?.click();
            });

            //(購入期限(日本時間))
            await page.waitForSelector('.react-datepicker__input-container input.bmm-c-text-field');
            await page.evaluate(() => {
                const deadline = document.querySelector(".react-datepicker__input-container input.bmm-c-text-field") as HTMLInputElement;
                deadline.value = "";
            });
            const purchaseDeadline = '90';
            await page.evaluate((purchaseDeadline) => {
                const deadlineElement = document.querySelector(".react-datepicker__input-container input.bmm-c-text-field") as HTMLInputElement;
                // 현재 deadline에서 날짜 읽기
                const currentDateStr = deadlineElement.value; // 'YYYY/MM/DD' 형식 가정
                const currentDate = new Date(currentDateStr);
                // 유효한 날짜인지 확인
                if (isNaN(currentDate.getTime())) {
                    console.error('Invalid date value:', currentDateStr);
                    return; // 유효하지 않은 날짜로 함수 실행 중단
                }
                // purchaseDeadline 만큼 날짜에 더하기
                const additionalDays = parseInt(purchaseDeadline, 10);
                currentDate.setDate(currentDate.getDate() + additionalDays);
                // 새 날짜를 YYYY/MM/DD 형식으로 변환
                const newDateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
                // 변환된 날짜 문자열을 deadline.value에 설정
                deadlineElement.value = newDateStr;
            }, purchaseDeadline);
            // 변경된 값을 적용하기 위해 Enter 키 이벤트를 발생시킵니다.
            await page.keyboard.press('Enter');

            //TODO (買付地) default값 그대로 사용
            //(発送地) default값 그대로 사용 -> [수정 2021/06/13] 発送地등록 추가
            // update 2021/8/12 page.waitForSelector()를 사용할 때, 선택자가 길면 잘 안되서 코멘트처리
            // await page.waitForSelector('.bmm-c-panel:nth-child(7) .bmm-c-panel__item:nth-child(4) .bmm-l-col-9 .bmm-c-field__input .bmm-c-radio:nth-child(2) .bmm-c-radio__body');
            // update 2021/8/22 page.click(여기를 짧게 줄였음)
            // await page.click('.bmm-c-panel:nth-child(7) .bmm-c-panel__item:nth-child(4) .bmm-l-col-9 .bmm-c-field__input .bmm-c-radio:nth-child(2) .bmm-c-radio__body');
            await page.click('.bmm-c-panel__item:nth-child(4) .bmm-c-radio:nth-child(2)');

            // await page.waitForSelector('#react-select-18--value-item');
            // await page.click('#react-select-18--value-item');
            await page.waitForSelector('#react-select-9--value-item');
            await page.click('#react-select-9--value-item');
            await page.waitForSelector('div[aria-label="アジア"]');
            await page.click('div[aria-label="アジア"]');
            // await page.waitForSelector('#react-select-19--value-item');
            // await page.click('#react-select-19--value-item');
            await page.waitForSelector('#react-select-10--value-item');
            await page.click('#react-select-10--value-item');
            await page.waitForSelector('div[aria-label="韓国"]');
            await page.click('div[aria-label="韓国"]');

            //(商品価格)
            await page.waitForSelector('.bmm-c-custom-text--unit-left input.bmm-c-text-field--half-size-char');
            await page.focus('.bmm-c-custom-text--unit-left input.bmm-c-text-field--half-size-char');
            await page.type('.bmm-c-custom-text--unit-left input.bmm-c-text-field--half-size-char',shopifyObject.variants[0].price);
            
            //(商品画像)
            try {
                imagePathArray = await readdir(join(__dirname, `../../../tempSave/${shopifyObject.title}`));
            } catch (error) {
                console.error("Error reading directory: ", error);
            }
            imagePathArray = imagePathArray.map((v) => {
                return join(__dirname, `../../../tempSave/${shopifyObject.title}/${v}`);
            });
            const[fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('.bmm-c-img-upload .bmm-c-img-upload__dropzone span'),
            ])
            await fileChooser.accept(imagePathArray);
            // await page.waitForTimeout(20000);
            await new Promise(r => setTimeout(r, 30000));

            //上書きボタンをクリックする
            await page.waitForSelector('.sell-btnbar button:nth-child(1)');
            await page.click('.sell-btnbar button:nth-child(1)');

            //에러 존재 확인 (에러가 존재하면 문자열로 만들어서 throw함)
            // await page.waitForTimeout(5000);
            await new Promise(r => setTimeout(r, 5000));
            let errData = await page.evaluate(() => {
                let errString = Array.from(document.querySelectorAll(".bmm-c-box--overall-alert ul li")).reduce((preVal,CurVal) => {
                        return preVal + "\n" + CurVal.textContent}, ""); 
                return errString;
            });
            if (errData) throw new SyntaxError(errData);

            await page.close();
            await browser.close();
        } catch(e) {
            // 메모리 누수 방지를 위해 Puppeteer의 브라우저 및 페이지 인스턴스를 닫음
            if (page) await page.close();
            if (browser) await browser.close();

            // 서버 측 디버깅을 위해 에러 로깅
            console.error(e);

            // 에러 유형에 따른 분기 처리
            // HttpException을 던져 서비스 레이어에서 이 예외를 캐치하고 적절히 처리할 수 있게 함
            // 사용자 정의 메시지 및 상태 코드를 포함하는 HttpException을 다시 던짐
            if (e instanceof SyntaxError) {
                // SyntaxError 발생 시
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: '구문 오류가 발생했습니다. 입력 데이터를 확인해주세요.',
                    detail: e.message,
                }, HttpStatus.BAD_REQUEST);
            } else {
                // 그 외 에러 처리
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Buyma 제품 생성 중 내부 서버 오류가 발생했습니다.',
                    detail: e.message,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}