import { ScrapeFootballStats } from './football/index.js'
import { ScrapeBasketballStats } from './basketball/index.js'
import { ScrapeHockeyStats } from './hockey/index.js'
import { ScrapeTennisStats } from './tennis/index.js'
import { ScrapeUFCStats } from './ufc/index.js'

// await ScrapeFootballStats()
await ScrapeBasketballStats()
await ScrapeHockeyStats()
await ScrapeTennisStats()
await ScrapeUFCStats()