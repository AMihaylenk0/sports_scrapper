export async function getKHLPlayers(page, league){
  page.setDefaultTimeout(0)
  let players = await parsePlayers(page)
  return {
    league,
    players,
  }
}

async function parsePlayers(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let nextBtnSelector = "a.paginate_button.next";
    await page.waitForSelector(nextBtnSelector);
    let isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).className.includes('disabled'), nextBtnSelector)
    while (!isNextBtnDisabled) {
      // await page.waitForSelector(nextBtnSelector);
      // await page.waitForTimeout(1000);
      await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).click(), nextBtnSelector);
      await parseData()
      isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).className.includes('disabled'), nextBtnSelector)
    }
    async function parseData(){
      await page.waitForSelector('.b-wide_block #players_dataTable_wrapper table');
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          ".b-wide_block #players_dataTable_wrapper table tr th:not([class*='control'])",
          (options) => options.map((option, index) => {
            if (index === 0) {
              return 'Игрок' 
            } else {
              return option.textContent.trim()
            }
          })
        )
      }
      const rows = await page.$$('.b-wide_block #players_dataTable_wrapper table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval("th, td:not([class*='control'])", (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let player = {}
            for (let i = 0; i < option.children.length; i++) {
              if (option.children[i].tagName === 'IMG') {
                player.imgSrc = option.children[i].getAttribute("src")
              } else {
                player.name = option.children[i].textContent.trim()
              }
            }
            return {[table_headers[index]] : player}
          } else {
            return {[table_headers[index]] : option.textContent.trim()}
          }
        }), table_headers));
      }
      let newarr = array.flatMap((x,i)=>{
        return Object.assign({}, ...x)
      })
      // newarr = newarr.map(x=> {
      //   return {
      //     ...x,
      //     'Игрок': formatString(x['Игрок'])
      //   }
      // })
      rowsValues.push(...newarr)
    }

    table_headers = table_headers.map(x=> {
      return {
        Header: x,
        accessor: x,
      }
    })
    return {
      headers: table_headers,
      rows: rowsValues
    }
  } catch (error) {
    console.error(error)
  }
}
