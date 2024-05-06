// Import the JSON file
import targets from "../../Target.json";

// Function to get site information
export function getSiteInfo(siteName: string) {
    // Find the site in the targets array
    const site = targets.websites.find((website: { name: string }) => website.name === siteName);

    // If the site is found, return the products
    if (site) {
        return site.products;
    }

    // If the site is not found, return undefined
    return undefined;
}