import axios from "axios"
import cheerio from "cheerio"
import {pAllSettled} from '../helpers/helpers.js'

const UFC_COMPLETEDGAMES_URL = "http://www.ufcstats.com/statistics/events/completed?page=all"
const UFC_UPCOMINGGAMES_URL = "http://www.ufcstats.com/statistics/events/upcoming?page=all"
let $

export async function parseUFCScedule() {
  try {
    // Parse scedule
    const completedScedule = await parseCompletedScedule(UFC_COMPLETEDGAMES_URL)
    const upcomingScedule = await parseCompletedScedule(UFC_UPCOMINGGAMES_URL)

    // Parse every event
    const events = await parseEvents(completedScedule, upcomingScedule)
    return {
      scedule: {
        completedScedule,
        upcomingScedule
      },
      events
    }
  } catch (err) {
    throw err
  }
}

async function parseCompletedScedule(url) {
  const res = await axios.get(url)
    $ = cheerio.load(res.data)
    const sceduleHtml = $('.b-statistics__table-row')
    // Parse all UFC weight divisions
    const completedScedule = []
    sceduleHtml.each((i, elem) => {
      const matchHtml = $(elem)
      const date = matchHtml.find('.b-statistics__date').text().trim()
      const title = matchHtml.find('.b-link.b-link_style_black').text().trim()
      const eventLink = matchHtml.find('.b-link.b-link_style_black').attr("href")
      const fightPlace = matchHtml.find('.b-statistics__table-col_style_big-top-padding').text().trim()
      const id = eventLink ? eventLink.split('/').pop() : null
      completedScedule.push({
        id,
        date,
        title,
        eventLink,
        fightPlace
      })
    })
    return completedScedule
}

async function parseEvents(completedScedule, upcomingScedule) {
  const completedEvents = await pAllSettled(
    completedScedule.map(x => async () => await parseCompletedGame(x)),
    10
  );
  const upcomingEvents = await pAllSettled(
    upcomingScedule.map(x => async () => await parseUpcomingGame(x)),
    10
  );
  return [...completedEvents, ...upcomingEvents]
}

async function parseCompletedGame(event) {
  const httpResp = await axios.get(event.eventLink)
  const $ = cheerio.load(httpResp.data)

  // event headers
  const headersHtml = $('thead .b-fight-details__table-col')
  const headers = []
  headersHtml.each((i, elem) => {
    const col = $(elem).text().trim()
    headers.push(col)
  })

  // event rows
  const rowsHtml = $('tbody tr.b-fight-details__table-row')
  let data = []
  rowsHtml.each((index, tr) => {
    const rows = []
    $(tr).find('td.b-fight-details__table-col').each((tdIndex,td) => {
      if (tdIndex === 0) {
        rows.push({
          [headers[tdIndex]]: 'Победа'
        })
      } else if (tdIndex === 1) {
        let cells = []
        $(td).find('.b-link.b-link_style_black').each((i,elem) => {
          const value = $(elem).text().trim()
          cells.push(value)
        })
        rows.push({
          [headers[tdIndex]]: cells
        })
      } else {
        const cells = []
        $(td).find('.b-fight-details__table-text').each((i, elem) => {
          const value = $(elem).text().trim()
          cells.push(value)
        })
        rows.push({
          [headers[tdIndex]]: cells
        })
      }
    })
    data.push(rows)
  })
  let newarr = data.flatMap((x,i)=>{
    return Object.assign({}, ...x)
  })
  return {
    eventId: event.id,
    fights: newarr
  }
}

async function parseUpcomingGame(event) {
  const httpResp = await axios.get(event.eventLink)
  const $ = cheerio.load(httpResp.data)

  // event headers
  const headersHtml = $('thead .b-fight-details__table-col')
  const headers = []
  headersHtml.each((i, elem) => {
    const col = $(elem).text().trim()
    headers.push(col)
  })

  // event rows
  const rowsHtml = $('tbody tr.b-fight-details__table-row')
  let data = []
  rowsHtml.each((index, tr) => {
    const rows = []
    $(tr).find('td.b-fight-details__table-col').each((tdIndex,td) => {
       if (tdIndex === 1) {
        let cells = []
        $(td).find('.b-link.b-link_style_black').each((i,elem) => {
          const value = $(elem).text().trim()
          cells.push(value)
        })
        rows.push({
          [headers[tdIndex]]: cells
        })
      } else {
        const cells = []
        $(td).find('.b-fight-details__table-text').each((i, elem) => {
          const value = $(elem).text().trim()
          cells.push(value)
        })
        rows.push({
          [headers[tdIndex]]: cells
        })
      }
    })
    data.push(rows)
  })
  let newarr = data.flatMap((x,i)=>{
    return Object.assign({}, ...x)
  })
  return {
    eventId: event.id,
    fights: newarr
  }
}