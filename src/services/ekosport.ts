import puppeteer from 'puppeteer';
import chalk from "chalk";
import {getSiteInfo} from "../utils/WebsiteSelector";

// EkoSport service
export const Ekosport = async () => {
    console.log(chalk.blue("Start Ekosport Service"));

    const Website = "ekosport";

    // Get the site information
    const siteInfo = getSiteInfo(Website);

    // Check if siteInfo is not undefined
    if (siteInfo) {
        console.log(chalk.bgBlue("List of categories:"));
        siteInfo.forEach((product: { name: string, url: string }) => {
            console.log(chalk.bold(`- ${product.name}`));
        });

        // Launch the browser
        const browser = await puppeteer.launch();

        // Counter for successful page loads
        let successfulLoads = 0;

        // Visit each product page
        for (const product of siteInfo) {
            const page = await browser.newPage();
            try {
                // Display a loading message
                process.stdout.write(`Loading page: ${product.url}... `);
                await page.goto(product.url);
                successfulLoads++;
                // Clear the loading message
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
            } catch (error) {
                console.log(chalk.red(`Failed to load page: ${product.url}`))
            }

            //Page actions
            await page.close();
        }

        // Close the browser
        await browser.close();

        // Log the number of successful page loads
        console.log(chalk.green(`${successfulLoads}/${siteInfo.length} pages loaded successfully for ${Website}`));
    } else {
        console.log(chalk.red("Site not found"))
    }

    // Return the site information
    return siteInfo;
}