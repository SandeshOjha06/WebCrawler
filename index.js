
import { crawl } from "./crawler.js";
import { saveJSON } from "./storage.js";

const seedURL = "https://www.trinity.edu.np/"

const data = await crawl(seedURL, 5);
console.log("Crawled Pages: ", data.length);

console.log(data);

saveJSON(data);
