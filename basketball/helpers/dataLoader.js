import puppeteer from "puppeteer"
import {getTeamsStats} from "./teamsStats.js"
import {getStandings} from "./standings.js"
import {getLeaderboards} from "./leaderboards.js"
import {getLeagueScedule} from "./scedule.js"

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
export async function fetchBasketballData({league, leagueUrl, sceduleUrl, standingsId}, page){
  console.log("Going to bballref website");
    await page.goto(leagueUrl);
    let teamsStats = await getTeamsStats(page)
    let standings = await getStandings(page, standingsId)
    let leaderboards = await getLeaderboards(page)
    // get scedule
    // let scedule = await getLeagueScedule(page, sceduleUrl)
    return {
      league: league,
      items : {
        teamsStats,
        standings,
        leaderboards,
        // scedule
      }
    }
}

