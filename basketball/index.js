import { fetchBasketballData, setupPuppeteer, closePuppeteer } from './helpers/dataLoader.js'
import { saveBasketballStats } from '../db/index.js'

const options = [
  {
    league: 'Euroleague',
    url: 'https://www.basketball-reference.com/international/euroleague/2021.html',
    standingsId: 'elg_standings'
  },
  {
    league: 'EuroCup',
    url: 'https://www.basketball-reference.com/international/eurocup/2021.html',
    standingsId: 'ecp_standings'
  },
  {
    league: 'vtb_United',
    url: 'https://www.basketball-reference.com/international/vtb-united/2021.html',
    standingsId: 'vtb_standings'
  },
  {
    league: 'SPA_Liga', /* Spain league */
    url: 'https://www.basketball-reference.com/international/spain-liga-acb/2021.html',
    standingsId: 'spa_standings'
  },
  {
    league: 'LNB_Pro_A', /* France league */
    url: 'https://www.basketball-reference.com/international/france-lnb-pro-a/2021.html',
    standingsId: 'fra_standings'
  },
  {
    league: 'Lega_Serie_A', /* Italia league */
    url: 'https://www.basketball-reference.com/international/italy-basket-serie-a/2021.html',
    standingsId: 'ita_standings'
  },
  {
    league: 'CBA_China', /* China league */
    url: 'https://www.basketball-reference.com/international/cba-china/2021.html',
    standingsId: 'chn_standings'
  },
]
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