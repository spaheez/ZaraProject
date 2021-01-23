const puppeteer = require('puppeteer');
import {ZARA_HOSTNAME} from '/home/marta/IdeaProjects/ZaraProject/constants.js'

export enum Website {
    SPAIN,
    RUSSIA,
    FRANCE,
    CROATIA,
    USA
}

export function getDomain(url: string): Website {
    if (url.includes(ZARA_HOSTNAME + "/es")) {
        return Website.SPAIN;
    }
    if (url.includes(ZARA_HOSTNAME + "/ru")) {
        return Website.RUSSIA;
    }
    if (url.includes(ZARA_HOSTNAME + "/fr")) {
        return Website.FRANCE;
    }
    if (url.includes(ZARA_HOSTNAME + "/hr")) {
        return Website.CROATIA;
    }
    if (url.includes(ZARA_HOSTNAME + "/us")) {
        return Website.USA;
    }
    else {
        throw "Url doesn't include Zara domain."
    }
}

export async function scrape(url: string, website: Website) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    async function getPrice(priceElement) {
        let txt = await priceElement.getProperty('textContent');
        let fullPrice = await txt.jsonValue();
        let numberPrice = fullPrice.replace(/[^0-9.,]/g, "");
        let finalPrice;
        let periodPrice = numberPrice.toString().replace(/,/g, '.');
        let fractionPrice = periodPrice[periodPrice.length - 3];
        if (fractionPrice === ".") {
            let strippedPrice = periodPrice.substring(0, periodPrice.length - 3);
            finalPrice = strippedPrice.split('.').join("");
        } else {
            finalPrice = periodPrice.split('.').join("");
        }
        browser.close();
        return finalPrice;
    }

    const getPriceUsingXPaths = async xpaths => {
        let index = 0
        let price
        while (!price && index < xpaths.length) {
            [price] = await page.$x(xpaths[index])
            index++
        }
        if (!price) throw "None of the xpaths retrieved the price!";
        return await getPrice(price)
    }

    const getXpathsByCountryWebsite = website => {
        switch (website) {
            case Website.SPAIN:
                return [
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span'
                ];
            case Website.RUSSIA:
                return [
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span'
                ];
            case Website.FRANCE:
                return [
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span'
                ];
            case Website.CROATIA:
                return [
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span'
                ];
            case Website.USA:
                return [
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span[2]/text()',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[3]/div/span',
                    '//*[@id="main"]/article/div[1]/div[2]/div[1]/div[2]/div/span'
                ];
        }
    }

    const xpathsByCountryWebsite = getXpathsByCountryWebsite(website);
    return getPriceUsingXPaths(xpathsByCountryWebsite);

}


