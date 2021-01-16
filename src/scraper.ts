// const puppeteer = require('puppeteer');
//
// export async function scrapeZara(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);
//
//     let price = await page.evaluate(() => {
//
//         let str = document.querySelector('span[class="main-price"]').textContent;
//         let match = /\d+(,\d+)?/.exec(str);
//         let number;
//         if (match) {
//             number = Number(match[0].replace(',', '.'));
//             console.log(number);
//         } else console.log("didnt find anything.");
//
//     });
//
//     console.log(price);
//
//     browser.close();
//
// }

const puppeteer = require('puppeteer');

export async function scrapeZara(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let priceElement
    const [salePriceElement] = await page.$x('//*[@id="product"]/div[1]/div/div[2]/div[1]/span[2]');
    if (salePriceElement) priceElement = salePriceElement
    else [priceElement] = await page.$x('//*[@id="product"]/div[1]/div/div[2]/div[1]/span');

    if (priceElement){
    const txt = await priceElement.getProperty('textContent');
    const fullPrice = await txt.jsonValue();

    let numberPrice = fullPrice.replace(/[^0-9.,]/g,"");
    let finalPrice;
    if (numberPrice) {
        let periodPrice = numberPrice.toString().replace(/,/g, '.');
        let fractionPrice = periodPrice[periodPrice.length - 3];
        if (fractionPrice == ".") {
            let strippedPrice = periodPrice.substring(0, periodPrice.length - 3);
            finalPrice = strippedPrice.split('.').join("");
        } else {
            finalPrice = periodPrice.split('.').join("");
        }
    }

    browser.close();
    return finalPrice;
} else {
        console.log("error");
    }
}
