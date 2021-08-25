export async function getFootballTeamsStats(page, teamsStatsUrl){
  page.setDefaultTimeout(0)
  await page.goto(teamsStatsUrl);
  let summuryStats = await getSummuryStats(page)
  let defenseStats = await getDefenseStats(page)
  let offensiveStats = await getOffensiveStats(page)
  return {
    summuryStats,
    defenseStats,
    offensiveStats
  }
}

async function getSummuryStats(page) {
  let table_headers
  let rowsValues = []
  try {
    await page.waitForSelector('#statistics-team-table-summary table');
    table_headers = await page.$$eval(
      "#statistics-team-table-summary table thead tr th",
      (options) => options.map((option) => option.textContent)
    )
    const rows = await page.$$('#statistics-team-table-summary table tbody tr');
    let array = []
    for (const row of rows) {
      array.push(await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
        if (option.className === 'aaa') {
          let cards = []
          for (let i = 0; i < option.children.length; i++) {
            cards.push(option.children[i].textContent);
          }
          return {[table_headers[index]] : cards}
        } else {
          return {
            [table_headers[index]] : option.textContent
          }
        }
      }), table_headers));
    }
    let newarr = array.flatMap((x,i)=>{
      return Object.assign({}, ...x)
    })
    newarr = newarr.map(x=> {
      return {
        ...x,
        'Команда': formatString(x['Команда'])
      }
    })
    rowsValues.push(...newarr)
    // map headers
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

async function getDefenseStats(page) {
  let table_headers
  let rowsValues = []
  let defBtnSelector = 'a[href="#stage-team-stats-defensive"]'
  try {
    await page.waitForSelector(defBtnSelector);
    await page.evaluate((defBtnSelector) => document.querySelector(defBtnSelector).click(), defBtnSelector);
    await page.waitForSelector('#statistics-team-table-defensive table');

    table_headers = await page.$$eval(
      "#statistics-team-table-defensive table thead tr th",
      (options) => options.map((option) => option.textContent)
    )
    const rows = await page.$$('#statistics-team-table-defensive table tbody tr');
    let array = []
    for (const row of rows) {
      array.push(await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
          return {
            [table_headers[index]] : option.textContent
          }
      }), table_headers));
    }
    let newarr = array.flatMap((x,i)=>{
      return Object.assign({}, ...x)
    })
    newarr = newarr.map(x=> {
      return {
        ...x,
        'Команда': formatString(x['Команда'])
      }
    })
    rowsValues.push(...newarr)
    // map headers
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
async function getOffensiveStats(page) {
  let table_headers
  let rowsValues = []
  let offBtnSelector = 'a[href="#stage-team-stats-offensive"]'
  try {
    await page.waitForSelector(offBtnSelector);
    await page.evaluate((offBtnSelector) => document.querySelector(offBtnSelector).click(), offBtnSelector);
    await page.waitForSelector('#statistics-team-table-offensive table');

    table_headers = await page.$$eval(
      "#statistics-team-table-offensive table thead tr th",
      (options) => options.map((option) => option.textContent)
    )
    const rows = await page.$$('#statistics-team-table-offensive table tbody tr');
    let array = []
    for (const row of rows) {
      array.push(await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
          return {
            [table_headers[index]] : option.textContent
          }
      }), table_headers));
    }
    let newarr = array.flatMap((x,i)=>{
      return Object.assign({}, ...x)
    })
    newarr = newarr.map(x=> {
      return {
        ...x,
        'Команда': formatString(x['Команда'])
      }
    })
    rowsValues.push(...newarr)
    // map headers
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

function formatString(str){
  return str.trim().split(/(\d+. )/).filter(Boolean)
}