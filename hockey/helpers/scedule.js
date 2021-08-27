export async function getKHLScedule(page, league){
  page.setDefaultTimeout(0)
  let scedule
  try {
    scedule = await page.evaluate(() => {
      let data = []
      for (const gameDay of [...document.querySelectorAll('.tab-calendar .b-final_cup_date')]) {
        // get headers
        let headers = []
        for (let i = 0; i < gameDay.children.length; i++) {
          if (gameDay.children[i].textContent !== '|') {
            headers.push(gameDay.children[i].textContent.trim());
          }
        }
        // get teams info
        let sibling = gameDay.nextElementSibling
        let games = []
        for (const game of [...sibling.querySelectorAll('.b-wide_tile_item')]) {
          let gamesInfo = {
            teams:{},
            timeOrScore: '',
            gameCity: ''
          }
          gamesInfo.teams.homeTeamName = game.querySelector('.b-details.m-club h5').innerText.trim()
          gamesInfo.teams.homeTeamCity = game.querySelector('.b-details.m-club p').innerText.trim()
          gamesInfo.teams.awayTeamName = game.querySelector('.b-details.m-club.m-rightward h5').innerText.trim()
          gamesInfo.teams.awayTeamCity = game.querySelector('.b-details.m-club.m-rightward p').innerText.trim()
          
          gamesInfo.timeOrScore = game.querySelector('.b-score .b-total_score h3').innerText.trim()
          gamesInfo.gameCity = game.querySelector('.b-score .b-period_score p').innerText.trim()
          games.push(gamesInfo)
        }
        data.push({
          header: headers,
          games
        })
      }
      return data
    })
  } catch (error) {
    console.error(error)
  }
  return {
    league,
    scedule,
  }
}
