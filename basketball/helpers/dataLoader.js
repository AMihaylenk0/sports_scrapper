import puppeteer from "puppeteer"
import {getTeamsStats} from "./teamsStats.js"
import {getStandings} from "./standings.js"
import {getLeaderboards} from "./leaderboards.js"

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
export async function close(browser, page){
  await page.close()
  await browser.close()
}
export async function fetchBasketballData({league, url, standingsId}, page){
  console.log("Going to bballref website");
    await page.goto(url);
    let teamsStats = await getTeamsStats(page)
    let standings = await getStandings(page, standingsId)
    let leaderboards = await getLeaderboards(page)
    return {
      league: league,
      items : {
        teamsStats,
        standings,
        leaderboards
      }
    }
}

