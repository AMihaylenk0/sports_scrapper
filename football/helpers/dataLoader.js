// import puppeteer from "puppeteer"
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import {getFootballStandings} from "./standings.js"
import {getFootballTeamsStats} from "./teamsStats.js"
import {getFootballPlayersStats} from "./playersStats.js"
puppeteer.use(StealthPlugin())

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
export async function fetchFootballData({league, standingsUrl, teamsStatsUrl, playersStatsUrl}, page){
    console.log("Going to website");
    //   await page.setExtraHTTPHeaders({
    //     'Accept-Language': 'ru-RU,ru-RU;q=0.9,ru;q=0.8'
    // });
    //  await page.setExtraHTTPHeaders({
    //   'dnt': '1',
    //   'referer': 'https://1xbet.whoscored.com/',
    //   'upgrade-insecure-requests': '1',
    //   'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    //   'accept-encoding': 'gzip, deflate, br',
    //   'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    //   'cache-control': 'max-age=0',
    //   'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
    //   'sec-ch-ua-mobile': '?0',
    //   'sec-fetch-dest': 'document',
    //   'sec-fetch-mode': 'navigate',
    //   'sec-fetch-site': 'cross-site',
    //   'sec-fetch-user': '?1',
    //   'user-agent': 'Mozilla/5.0 (Windws NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    //   'DNT': '1',
    //   'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
    //   'sec-ch-ua-mobile': '?0',
    //   'Referer': 'https://ru.whoscored.com/',
    //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    // });
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
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

