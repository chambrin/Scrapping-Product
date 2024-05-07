import puppeteer from 'puppeteer';
import chalk from "chalk";
import {getSiteInfo} from "../utils/WebsiteSelector";
import { ScrappingData} from "./actions/actions";
import {ProgressBarManager} from "../bin/ProgressBarManager";
import {saveAllData, saveData} from "../utils/DataManagers";

// EkoSport service
export const Ekosport = async () => {
    console.log(chalk.blue("Start Ekosport Service"));

    const Website = "ekosport";

    // Initialize allProductData as an empty array
    let allProductData: any[] = [];

    // Initialize a map to store product data by category
    let productDataByCategory: { [key: string]: any[] } = {};

    // Get the site information
    const siteInfo = getSiteInfo(Website);

    // Create a new instance of ProgressBarManager
    const progressBarManager = new ProgressBarManager();

    // Check if siteInfo is not undefined
    if (siteInfo) {
        console.log(chalk.bgBlue("List of categories:"));
        siteInfo.forEach((product: { name: string, url: string }) => {
            console.log(chalk.bold(`- ${product.name}`));
        });

        // Launch the browser no headless
        const browser = await puppeteer.launch({ headless: true }); // default is true

        // Counter for successful page loads
        let successfulLoads = 0;

        // Total product count
        let totalProductCount = 0;

        // Store the product counts
        let productCounts: number[] = [];

        // Visit each shop page
        for (const product of siteInfo) {
            const page = await browser.newPage();
            try {
                // Display a loading message
                process.stdout.write(`Loading page: ${product.url}... `);
                await page.goto(product.url);
                successfulLoads++;

                // Wait for a second to allow products to load
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Count the number of products on the page
                const productCount = await page.$$eval('.product-tile-top', products => products.length);
                console.log(chalk.italic(`Found ${productCount} products`));
                totalProductCount += productCount;

                // Store the product count
                productCounts.push(productCount);


                // Clear the loading message
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);

            } catch (error) {
                console.log(chalk.red(`Failed to load page: ${product.url}`))
            }
            //Page actions
            await page.close();
        }

        // Log the number of successful page loads
        console.log(chalk.blue(`${successfulLoads}/${siteInfo.length} pages loaded successfully for ${Website}`));
        console.log(chalk.magenta(`Total product count for ${totalProductCount}`));

        // Create a new progress bar instance with totalProductCount
        progressBarManager.createBar(totalProductCount);

        // Loop over the products and call ScrappingData
        for (const product of siteInfo) {
            // Scrape the product data
            const productData = await ScrappingData(browser, product, progressBarManager);
            console.log(productData);

            // Add the product data to the corresponding category in productDataByCategory
            if (!productDataByCategory[product.name]) {
                productDataByCategory[product.name] = [];
            }
            productDataByCategory[product.name] = productDataByCategory[product.name].concat(productData);

            // Add the product data to allProductData
            allProductData = allProductData.concat(productData);
        }

        // Save the product data to a JSON file for each category
        for (const category in productDataByCategory) {
            saveData(productDataByCategory[category], 'ekosport', category);
        }

        // Save all the product data to a JSON file
        saveAllData(allProductData, 'ekosport');

        // Close the browser
        await browser.close();

    } else {
        console.log(chalk.red("Site not found"))
    }
    // Return the site information
    return siteInfo;
}