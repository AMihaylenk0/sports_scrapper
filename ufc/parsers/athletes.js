import axios from "axios"
import cheerio from "cheerio"

const UFC_ATHLETE_URL = "https://ru.ufc.com/athlete"

export async function parseAthleteProfiles(leaders) {
  let profilePromises = []
  for (const leader of leaders) {
    // top1 profile
    profilePromises.push(parseAthleteProfile(leader.items.top1.athleteId))
    // contender profiles
    for (let contender of leader.items.contenders) {
      profilePromises.push(parseAthleteProfile(contender.athleteId))
    }
  }
  return Promise.allSettled(profilePromises)
    .then(profiles => {
      let ufcAthleteProfiles = profiles.map(x => x.value)
      // console.log(ufcAthleteProfiles, 'ufcAthleteProfiles')
      return ufcAthleteProfiles
    })
    .catch(err => {
      throw err
    })
}

async function parseAthleteProfile(athleteId) {
  const httpResp = await axios.get(UFC_ATHLETE_URL + "/" + athleteId)

  const $ = cheerio.load(httpResp.data)
  // athlete name
  const name = $('.c-hero--full__headline').text().trim()
  // athlete bio info
  const bioData = $('.c-bio__text')
  const bioLabels = $('.c-bio__label')
  let bioItems = []
  const bio = {}
  let mapLabels = (label) => {
    if (label === 'Статус') {
      return 'status'
    } else if (label === 'Родной город') {
      return 'city'
    } else if (label === 'Зал') {
      return 'gym'
    } else if (label === 'Возраст') {
      return 'age'
    } else if (label === 'Рост') {
      return 'height'
    } else if (label === 'Вес') {
      return 'weight'
    } else if (label === 'Дебют в октагоне') {
      return 'debuteDate'
    } else if (label === 'Размах рук') {
      return 'armSpan'
    } else if (label === 'Размах ног') {
      return 'legSpan'
    }
  }
  bioData.each((i, elem) => {
    const data = $(elem).text().trim()
    bioItems.push(data)
  })
  bioLabels.each((i, elem) => {
    let label = $(elem).text().trim()
    label = mapLabels(label)
    bio[label] = bioItems[i]
  })
  // athlete image
  const atheleteImg = $('.c-bio__image').find('img').attr("src")

  // athlete country
  const country = bio['city'] ? getCountryFromHometown(bio['city']) : ""

  // win-loss-draw
  const headlineHtml = $('.c-hero--full .c-hero__headline-suffix')
  // const tokens = headlineHtml.text().replace(/(\r\n|\n|\r)/gm,"").split(/\s+/)
  const tokens = headlineHtml.text().split('\n').map(e=>e.trim()).filter(Boolean)
  const division = tokens.length ? tokens.filter(x => isNaN(x.charAt(0))).join(', ') : ''
  const winLossDraw = tokens.length ? tokens.filter(x => !isNaN(x.charAt(0)))[0] : ''

  const wldTokens = winLossDraw && winLossDraw.split('-')
  const wins = wldTokens[0] ? wldTokens[0] : ''
  const losses = wldTokens[1] ? wldTokens[1] : ''
  const draws = wldTokens[2] ? wldTokens[2].split(" ")[0] : ''

  // promoted stats
  const promotedStatsHtml = $('.c-record__promoted-figure')
  const promotedStatsLabelsHtml = $('.c-record__promoted-text')
  let promotedStats = []
  let statsData = []

  promotedStatsHtml.each((i, elem) => {
    const statData = $(elem).text()
    statsData[i] = Number(statData)
  })
  promotedStatsLabelsHtml.each((i, elem) => {
    const statLabel = $(elem).text()
    if (statLabel) {
      promotedStats.push({ 
        "stat": statLabel,
        "data": statsData[i]
      })
    }
  })

  // striking and grappling accuracy
  const accuracyHtml = $('.e-chart-circle__percent').contents()
  const strikingAccuracy = accuracyHtml[0] ? accuracyHtml[0].data : ""
  const grapplingAccuracy = accuracyHtml[1] ? accuracyHtml[1].data : ""

  // significant strikes and takedowns
  const statsTextHtml = $('.c-overlap__stats-text')
  const statsValueHtml = $('.c-overlap__stats-value')
  let strikesTakedownsValues = []
  let fightingStats = []

  statsValueHtml.each((i, elem) => {
    const statData = $(elem).text()
    strikesTakedownsValues[i] = Number(statData)
  })
  statsTextHtml.each((i, elem) => {
    const statLabel = $(elem).text()
    if (statLabel) {
      fightingStats.push({
        "stat": statLabel,
        "data": strikesTakedownsValues[i]
      })
    }
  })

  const profile = {
    athleteId,
    name,
    nickname: $('.field-name-nickname').text().trim().replace(/['"]+/g, ''),
    division,
    atheleteImg,
    country,
    wins,
    losses,
    draws,
    ...bio,
    strikingAccuracy,
    grapplingAccuracy,
    fightingStats,
    promotedStats
  }
  return profile
}

function getCountryFromHometown(hometown) {
  const hometownTokens = hometown.split(",")
  const country = hometownTokens.length > 1 ? hometownTokens[1].trim()
    : hometownTokens[0].trim()

  return country
}