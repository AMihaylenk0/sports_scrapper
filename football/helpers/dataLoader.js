import puppeteer from "puppeteer"
import {getFootballStandings} from "./standings.js"
import {getFootballTeamsStats} from "./teamsStats.js"
import {getFootballPlayersStats} from "./playersStats.js"

export async function setupPuppeteer(){
  const browser = await puppeteer.launch(
    {
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', "--no-sandbox", "--disable-setuid-sandbox", '--disable-gpu']
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
export async function fetchFootballData({league, standingsUrl, teamsStatsUrl, playersStatsUrl}, page){
    console.log("Going to website");
    // await page.reload({ waitUntil: ["networkidle2"] });
    let standings = await getFootballStandings(page, standingsUrl)
    let teamsStats = await getFootballTeamsStats(page, teamsStatsUrl)
    let playersStats = await getFootballPlayersStats(page, playersStatsUrl)
    return {
      league: league,
      items : {
        standings,
        teamsStats,
        playersStats
      }
    }
}

