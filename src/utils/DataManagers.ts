// src/utils/DataManager.ts
import fs from 'fs';
import path from 'path';

export function saveData(data: any, source: string, category: string) {
    // Convert the data to JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Create the data directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, `../../data/${source}/${category}`))) {
        fs.mkdirSync(path.resolve(__dirname, `../../data/${source}/${category}`), { recursive: true });
    }

    // Define the file path
    const filePath = path.resolve(__dirname, `../../data/${source}/${category}/${category}.json`);

    // Delete the file if it exists
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Write the JSON data to a file in the data directory
    fs.writeFileSync(filePath, jsonData);
}

export function saveAllData(data: any, source: string) {
    // Convert the data to JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Create the data directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, `../../data/${source}`))) {
        fs.mkdirSync(path.resolve(__dirname, `../../data/${source}`), { recursive: true });
    }

    // Define the file path
    const filePath = path.resolve(__dirname, `../../data/${source}/allProducts.json`);

    // Delete the file if it exists
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Write the JSON data to a file in the data directory
    fs.writeFileSync(filePath, jsonData);
}