import { fetchKHLData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveHockeyStats } from '../db/utils/hockey/index.js'
import { options } from './config.js'

async function run(){
  let {browser, page} = await setupPuppeteer()
  let { standings, scedule} = await fetchKHLData(options, page)
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
  await saveHockeyStats(KHLStandings,KHLScedule)
}
run()