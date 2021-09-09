import puppeteer from "puppeteer"
import {getTennisRankings} from "../parsers/rankings.js"
import {getTennisScedule} from "../parsers/scedule.js"
// import {getLeaderboards} from "./leaderboards.js"

export async function setupPuppeteer(){
  const browser = await puppeteer.launch(
    {
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized']
  }
  );

  console.log("Opening page...");
  const page = await browser.newPage();
  return {browser, page}
}
export async function closePuppeteer(browser, page){
  await page.close()
  await browser.close()
}
export async function fetchTennisData(options, page){
    console.log("Going to website");
    let rankings, scedule
    for (const option of options) {
      let { url, category } = option
      await page.goto(url);
      if (category === 'rankings') {
        rankings = await getTennisRankings(page)
      }
      if (category === 'scedule') {
        scedule = await getTennisScedule(page)
      }
    }
    return {
      rankings,
      scedule
    }
}

