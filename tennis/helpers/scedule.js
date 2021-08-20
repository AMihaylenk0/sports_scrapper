export async function getTennisScedule(page){
  let items
  try {
    items = await page.evaluate(() => {
      let tournaments = []
      // iterate through tournaments
      for (const tournamentNode of [...document.querySelectorAll('.mc-sport-tournament._collapsible')]) {
        let matches = []
        let title = tournamentNode.querySelector('a.title__link').textContent
        for (const matchNode of [...tournamentNode.querySelectorAll('a.tennis-results.js-match-item')]) {
          let time = matchNode.querySelector('.tennis-results__item._time').textContent.trim()
          let status = matchNode.querySelector('.tennis-results__status').textContent.trim()
          let playersNodes = matchNode.querySelectorAll('.tennis-results__item._scoreboard .tennis-results__team')
          let players = []
          for (const playerNode of playersNodes) {
            let nameAndCountry = playerNode.querySelector('.tennis-results__team-name').textContent
            let arr = nameAndCountry.split('(')
            let playerName = arr[0]
            let country = arr[1].split(')')[0]
            let scoresStr = playerNode.querySelector('.tennis-results__score').textContent.trim()
            scoresStr = scoresStr.trim().replace(/\s+/g, '').split(/([a-zA-Z]+)/) // array of scores and optional retirement status
            let scores = scoresStr[0].split('')
            let retirement = scoresStr[1] || null
            players.push({playerName, country, scores, retirement})
          }
          let match = {
            time,
            status,
            players
          }
          matches.push(match)
        }
        let tournament = {
          title,
          matches
        }
        tournaments.push(tournament)
      }
      return tournaments
    });
  } catch (error) {
    console.error(error)
  }
  return {
    items
  }
}

