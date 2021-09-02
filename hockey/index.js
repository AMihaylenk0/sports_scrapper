import { fetchKHLData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveHockeyStats } from '../db/utils/hockey/index.js'
import { options } from './config.js'

async function run(){
  let {browser, page} = await setupPuppeteer()
  let { standings, scedule, teamsStats} = await fetchKHLData(options, page)
  await closePuppeteer(browser, page)
  let KHLScedule = {
      league: scedule.league,
      season: 2021,
      items: scedule
    }
  let KHLStandings = {
      league: standings.league,
      season: 2021,
      items: standings
    }
  let KHLTeamsStats = {
      league: teamsStats.league,
      season: 2021,
      items: teamsStats
    }
  await saveHockeyStats(KHLStandings, KHLScedule, KHLTeamsStats)
}
run()