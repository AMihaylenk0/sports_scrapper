import { fetchBasketballData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveBasketballStats } from '../db/index.js'
import { options } from './config.js'

async function run(){
  let {browser, page} = await setupPuppeteer()
  let data = []
  for (const option of options) {
    data.push(await fetchBasketballData(option, page))
  }
  await closePuppeteer(browser, page)

  let basketballStandings = data.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'standings',
      items: x.items.standings
    }
  })
  let basketballTeamsStats = data.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'teamsStats',
      items: x.items.teamsStats
    }
  })
  let basketballLeaderboards = data.map(x=>{
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