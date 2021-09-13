import axios from "axios"
import cheerio from "cheerio"
import {parseAthleteProfiles} from "./athletes.js"

const UFC_STATLEADERS_URL = "http://statleaders.ufc.com/ru/"
const LEADERS_SELECTOR = '.results-group'
let $

export async function parseUFCLeadersAndAtheletes() {
  try {
    const res = await axios.get(UFC_STATLEADERS_URL)
    $ = cheerio.load(res.data)
    const leadersStatsHtml = $(LEADERS_SELECTOR)
    // Parse all UFC weight divisions
    const leaders = []
    leadersStatsHtml.each((i, elem) => {
      const categoryHtml = $(elem)
      const categoryTitle = categoryHtml.find('header h3').text().trim()
      let {headers, top1, contenders} = parseLeaders(categoryHtml)
      const category = {
        headers,
        top1,
        contenders
      }
      leaders.push({
        categoryTitle,
        items: category
      })
    })

    // Parse all athlete profiles
    const athletes = await parseAthleteProfiles(leaders)
    return {
      leaders,
      athletes,
    }
  } catch (err) {
    throw err
  }
}

function parseLeaders(leadersHtml) {
  const fighters = leadersHtml.find('.results-table--tr')
  let headers = []
  let top1 = {}
  let contenders = []
  fighters.each((i, elem) => {
    if (i === 0) {
      let headersSet = new Set();
      $(elem).find('span').each((i,e) => {
        if ($(e).text()) {
          headersSet.add($(e).text())
        }
      })
      headers.push(...headersSet)
    } else if (i === 1) {
      top1.rank = $(elem).find('span:nth-child(1)').text()
      top1.name = $(elem).find('span:nth-child(2) a').text()
      let splitUrl = $(elem).find('span:nth-child(2) a').attr("href").split('/')
      top1.athleteId = splitUrl[splitUrl.length - 1]
      top1.value = $(elem).find('span:nth-child(3)').text()
      top1.img = $(elem).find('img').attr("src")
    } else {
      let fighter = {}
      fighter.rank = $(elem).find('span:nth-child(1)').text()
      fighter.name = $(elem).find('span:nth-child(2) a').text()
      let splitUrl = $(elem).find('span:nth-child(2) a').attr("href").split('/')
      fighter.athleteId = splitUrl[splitUrl.length - 1]
      fighter.value = $(elem).find('span:nth-child(3)').text()
      contenders.push(fighter)
    }
  })
  let items = {
    headers,
    top1,
    contenders
  }
  return items
}
