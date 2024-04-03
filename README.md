# Scrape GL

Given a website's URL, this script uses puppeteer to download all GLB files.

## Usage 

Install dependencies

`npm install`

Create a `.env` file. `URL` refers to the url of the website to scrape. `FILEPATH_PREFIX` is a prefix for the CDN where the GLB files are stored. This will differ from site-to-site so peek into the network tab to check this out.

You might also want to adjust the logic of the `getFileName` function depending on how the files are hosted.

All GLBs are downloaded to the output folder along with a JSON file with all the other network requests.