import { fetchFootballData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveFootballStats } from '../db/utils/football/index.js'
import { options } from './config.js'

export async function ScrapeFootballStats(){
  let {browser, page} = await setupPuppeteer()
  let footballData = []
  for (const option of options) {
    footballData.push(await fetchFootballData(option, page))
    console.log(`data for ${option.league} loaded`)
  }
  await closePuppeteer(browser, page)
  let footballStandings = footballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'standings',
      items: x.items.standings
    }
  })
  let footballTeamsStats = footballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'teamsStats',
      items: x.items.teamsStats
    }
  })
  let footballPlayersStats = footballData.map(x=>{
    return {
      season: 2021,
      league: x.league,
      statsCategory: 'playersStats',
      items: x.items.playersStats
    }
  })
  await saveFootballStats(footballStandings, footballTeamsStats, footballPlayersStats)
}