import { fetchTennisData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveTennisStats } from '../db/utils/tennis/index.js'
import { options } from './config.js'

export async function ScrapeTennisStats(){
  let {browser, page} = await setupPuppeteer()
  let { rankings, scedule} = await fetchTennisData(options, page)
  await closePuppeteer(browser, page)
  let tennisScedule = {
      season: 2021,
      items: scedule
    }
  let tennisRankings = {
      season: 2021,
      items: rankings
    }
  await saveTennisStats(tennisRankings,tennisScedule)
}