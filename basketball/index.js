import { fetchBasketballData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveBasketballStats } from '../db/utils/basketball/index.js'
import { options } from './config.js'

async function run(){
  let {browser, page} = await setupPuppeteer()
  let basketballData = []
  for (const option of options) {
    basketballData.push(await fetchBasketballData(option, page))
  }
  await closePuppeteer(browser, page)

  let basketballStandings = basketballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'standings',
      items: x.items.standings
    }
  })
  let basketballTeamsStats = basketballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'teamsStats',
      items: x.items.teamsStats
    }
  })
  let basketballLeaderboards = basketballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'leaderboards',
      items: x.items.leaderboards
    }
  })
  await saveBasketballStats(basketballLeaderboards, basketballStandings, basketballTeamsStats)
}
run()