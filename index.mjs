import puppeteer from "puppeteer";
import fs from "fs";
import 'dotenv/config'

// Note: modify getFileName according to the webpage
const getFileName = (url) => {
  return url
    .replace(process.env.FILEPATH_PREFIX, "")
    .split("?t=")[0]
    .split("/")
    .slice(-1)[0];
};

const writeJson = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync("./output/data.json", jsonString);
  console.log("file written!");
};

async function downloadFiles(urls) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].url;
    const filename = getFileName(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: status ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      await fs.writeFileSync('./output/'+filename, Buffer.from(buffer));

      console.log(`Downloaded: ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error);
    }
  }
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  const networkRequests = [];
  page.on("request", (interceptedRequest) => {
    networkRequests.push({
      url: interceptedRequest.url(),
      method: interceptedRequest.method(),
      resourceType: interceptedRequest.resourceType(),
    });
    interceptedRequest.continue();
  });

  await page.goto(process.env.URL);

  // Wait for the page to load
  await page.waitForNetworkIdle();

  const filteredData = networkRequests.filter((obj) =>
    obj.url.includes(".glb")
  );

  try {
    await downloadFiles(filteredData);
  } catch (error) {
    console.error("Error downloading files:", error);
  }

  writeJson(filteredData);

  await browser.close();
})();
