import puppeteer from 'puppeteer';
import chalk from "chalk";
import { Product } from '../../../types/product.type';
import {ProgressBarManager} from "../../bin/ProgressBarManager";


export async function ScrappingData(browser: puppeteer.Browser, shop: { name: string, url: string }, progressBarManager: ProgressBarManager) {
    const page = await browser.newPage();
    let productData: Product[] = []; // Initialize productData as an empty array

    try {
        // Go to the product page
        await page.goto(shop.url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Log the visited product page URL
        console.log(chalk.cyan('Visited shop page: ' + shop.url));

        // Wait for a second to allow products to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get all the product elements
        const productElements = await page.$$('.product-tile-top a');

        // Create an array to store the product URLs
        let productUrls: string[] = [];

        // Loop over each product element
        for (const productElement of productElements) {
            // Get the product URL
            const productUrl = await page.evaluate((el: HTMLAnchorElement) => el.href, productElement);

            // Add the product URL to the array
            productUrls.push(productUrl);
        }

// Visit each product URL and get the product details
        for (const productUrl of productUrls) {
            if (productUrl) { // Check if productUrl is not undefined
                try {
                    // Go to the product page
                    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 10000 });

                    // Add a delay to allow the page to load completely
                    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 2 seconds

                    // Scrape the product details
                    const product: Product = await page.evaluate(() => {
                        const name = document.querySelector('ish-product-name span[itemprop="name"]')?.textContent || '';
                        const price = parseFloat(document.querySelector('meta[itemprop="price"]')?.getAttribute('content') || '0');
                        const description = Array.from(document.querySelectorAll('div.ng-star-inserted p')).map(p => p.textContent).join(' ') || '';
                        const imageUrl = document.querySelector('img[itemprop="image"]')?.getAttribute('src') || '';

                        return { name, url: window.location.href, price, description, imageUrl };
                    });

                    // Add the product to the productData array
                    productData.push(product);

                    progressBarManager.updateBar(1);

                } catch (error) {
                    console.log(`Failed to load page: ${productUrl}`)
                }
            } else {
                console.log('Product URL is undefined ')
            }
        }
    } catch (error) {
        console.log(`Failed to load page: ${shop.url}`)
    }

    //Page actions
    await page.close();

    // Add a delay of 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return productData;
}