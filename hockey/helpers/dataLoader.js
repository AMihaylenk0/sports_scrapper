import puppeteer from "puppeteer"
import {getKHLStandings} from "../parsers/standings.js"
import {getKHLScedule} from "../parsers/scedule.js"
import {getKHLTeamsStats} from "../parsers/teamsStats.js"
import {getKHLPlayersStats} from "../parsers/playersStats.js"
import {getKHLPlayers} from "../parsers/players.js"
// import {getLeaderboards} from "./leaderboards.js"

export async function setupPuppeteer(){
  function* generateUserAgent() {
    let webkitVersion = 10;
    let chromeVersion = 1000;
  
    const so = [
      'Windows NT 6.1; WOW64',
      'Windows NT 6.2; Win64; x64',
      "Windows NT 5.1; Win64; x64",
      'Macintosh; Intel Mac OS X 10_12_6',
      "X11; Linux x86_64",
      "X11; Linux armv7l"
    ];
    let soIndex = Math.floor(Math.random() * so.length);
  
    while (true) {
      yield `Mozilla/5.0 (${so[soIndex++ % so.length]}) AppleWebKit/537.${webkitVersion} (KHTML, like Gecko) Chrome/56.0.${chromeVersion}.87 Safari/537.${webkitVersion} OPR/43.0.2442.991`;
  
      webkitVersion++;
      chromeVersion++;
    }
  }

  const browser = await puppeteer.launch(
    {
      headless: true,
      defaultViewport: null,
      args: ['--start-maximized', "--no-sandbox", "--disable-setuid-sandbox", '--disable-gpu']
    }
  );
  console.log("Opening page...");
  const page = await browser.newPage();
  // set User agent
  const userAgents = generateUserAgent();
  await page.setUserAgent(userAgents.next().value);
  return {browser, page}
}
export async function closePuppeteer(browser, page){
  await page.close()
  await browser.close()
}
export async function fetchKHLData(options, page){
    console.log("Going to website");
    let standings, scedule, teamsStats, playersStats, players
    for (const option of options) {
      let { url, category, league } = option
      await page.goto(url);
      if (category === 'standings') {
        standings = await getKHLStandings(page, league)
      }
      if (category === 'scedule') {
        scedule = await getKHLScedule(page, league)
      }
      if (category === 'teams_stats') {
        teamsStats = await getKHLTeamsStats(page, league)
      }
      if (category === 'players_stats') {
        playersStats = await getKHLPlayersStats(page, league)
      }
      if (category === 'players') {
        players = await getKHLPlayers(page, league)
      }
    }
    return {
      standings,
      scedule,
      teamsStats,
      playersStats,
      players
    }
}

