import puppeteer from 'puppeteer';

export async function ScrappingData(browser: puppeteer.Browser, product: { name: string, url: string }) {
    const page = await browser.newPage();
    let productData: any = null;

    try {
        // Go to the product page
        await page.goto(product.url);

        // Log the visited product page URL
        console.log('Visited product page: ' + product.url);

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

        // Log the product URLs
        console.log('Product URLs: ', productUrls);

        // Return the product URLs
        productData = productUrls;

    } catch (error) {
        console.log(`Failed to load page: ${product.url}`)
    }

    //Page actions
    await page.close();

    // Add a delay of 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return productData;
}