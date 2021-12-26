export async function getFootballPlayersStats(page, playersStatsUrl){
  page.setDefaultTimeout(0)
  await page.goto(playersStatsUrl);
  let summuryStats = await getSummuryStats(page)
  let defenseStats = await getDefenseStats(page)
  let offensiveStats = await getOffensiveStats(page)
  let assistsStats = await getAssistsStats(page)
  return {
    summuryStats,
    defenseStats,
    offensiveStats,
    assistsStats
  }
}

async function getSummuryStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let nextBtnSelector = "#statistics-paging-summary #next";
    await page.waitForSelector(nextBtnSelector);
    let isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    while (!isNextBtnDisabled) {
      await page.waitForSelector(nextBtnSelector);
      await page.waitForTimeout(1000);
      await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).click(), nextBtnSelector);
      await parseData()
      isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    }
    async function parseData(){
      await page.waitForSelector('#statistics-table-summary table');
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          "#statistics-table-summary table thead tr th:not(.grid-ghost-cell)",
          (options) => options.map((option) => option.textContent)
        )
      }
      const rows = await page.$$('#statistics-table-summary table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not(.grid-ghost-cell)', (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let items = []
            for (let i = 0; i < option.children.length; i++) {
              items.push(option.children[i].textContent.trim());
            }
            return {[table_headers[index]] : items}
          } else {
            return {
              [table_headers[index]] : option.textContent.trim()
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
          'Игрок': formatString(x['Игрок'])
        }
      })
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
async function getDefenseStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let defBtnSelector = 'a[href="#stage-top-player-stats-defensive"]'
    await page.waitForSelector(defBtnSelector);
    await page.evaluate((defBtnSelector) => document.querySelector(defBtnSelector).click(), defBtnSelector);

    let nextBtnSelector = "#statistics-paging-defensive #next";
    await page.waitForSelector(nextBtnSelector);
    let isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)

    while (!isNextBtnDisabled) {
      await page.waitForSelector(nextBtnSelector);
      await page.waitForTimeout(1000);
      await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).click(), nextBtnSelector);
      await parseData()
      isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    }
    async function parseData(){
      await page.waitForSelector('#statistics-table-defensive table');
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          "#statistics-table-defensive table thead tr th:not(.grid-ghost-cell)",
          (options) => options.map((option) => option.textContent)
        )
      }
      const rows = await page.$$('#statistics-table-defensive table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not(.grid-ghost-cell)', (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let items = []
            for (let i = 0; i < option.children.length; i++) {
              items.push(option.children[i].textContent.trim());
            }
            return {[table_headers[index]] : items}
          } else {
            return {
              [table_headers[index]] : option.textContent.trim()
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
          'Игрок': formatString(x['Игрок'])
        }
      })
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
async function getOffensiveStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let offBtnSelector = 'a[href="#stage-top-player-stats-offensive"]'
    await page.waitForSelector(offBtnSelector);
    await page.evaluate((offBtnSelector) => document.querySelector(offBtnSelector).click(), offBtnSelector);

    let nextBtnSelector = "#statistics-paging-offensive #next";
    await page.waitForSelector(nextBtnSelector);
    let isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    
    while (!isNextBtnDisabled) {
      await page.waitForSelector(nextBtnSelector);
      await page.waitForTimeout(1000);
      await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).click(), nextBtnSelector);
      await parseData()
      isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    }
    async function parseData(){
      await page.waitForSelector('#statistics-table-offensive table');
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          "#statistics-table-offensive table thead tr th:not(.grid-ghost-cell)",
          (options) => options.map((option) => option.textContent)
        )
      }
      const rows = await page.$$('#statistics-table-offensive table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not(.grid-ghost-cell)', (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let items = []
            for (let i = 0; i < option.children.length; i++) {
              items.push(option.children[i].textContent.trim());
            }
            return {[table_headers[index]] : items}
          } else {
            return {
              [table_headers[index]] : option.textContent.trim()
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
          'Игрок': formatString(x['Игрок'])
        }
      })
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
async function getAssistsStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let astBtnSelector = 'a[href="#stage-top-player-stats-passing"]'
    await page.waitForSelector(astBtnSelector);
    await page.evaluate((astBtnSelector) => document.querySelector(astBtnSelector).click(), astBtnSelector);

    let nextBtnSelector = "#statistics-paging-passing #next";
    await page.waitForSelector(nextBtnSelector);
    let isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    
    while (!isNextBtnDisabled) {
      await page.waitForSelector(nextBtnSelector);
      await page.waitForTimeout(1000);
      await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector).click(), nextBtnSelector);
      await parseData()
      isNextBtnDisabled = await page.evaluate((nextBtnSelector) => document.querySelector(nextBtnSelector)?.className?.includes('disabled'), nextBtnSelector)
    }
    async function parseData(){
      await page.waitForSelector('#statistics-table-passing table');
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          "#statistics-table-passing table thead tr th:not(.grid-ghost-cell)",
          (options) => options.map((option) => option.textContent)
        )
      }
      const rows = await page.$$('#statistics-table-passing table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not(.grid-ghost-cell)', (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let items = []
            for (let i = 0; i < option.children.length; i++) {
              items.push(option.children[i].textContent.trim());
            }
            return {[table_headers[index]] : items}
          } else {
            return {
              [table_headers[index]] : option.textContent.trim()
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
          'Игрок': formatString(x['Игрок'])
        }
      })
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
function formatString(str){
  let newarr = str.shift().split(/(\d+)/).filter(Boolean)
  return [...newarr, ...str]
}