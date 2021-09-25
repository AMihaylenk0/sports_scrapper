export async function getFootballStandings(page, standingsUrl, league){
  page.setDefaultTimeout(0)
  await page.goto(standingsUrl);
  await page.waitForSelector('.tournament-standings-table');

  if (league === 'champions_league' || league === 'europa_league') {
    // parse titles
    try {
      let titles = []
      titles = await page.$$eval(
        ".tournament-tables-header",
        (options) => options.map((option) => option.textContent.trim())
      )
      
      // parse groups    
      const groupTables = await page.$$('.tournament-standings-table table[id^="standings"]');
      let groups = []
      let table_headers = []

      for (const table of groupTables) {
        // getting tables
        if (!table_headers.length) {
          table_headers = await table.$$eval(
            "thead tr[class*='general-header'] th",
            (options) => options.map((option) => option.textContent)
          )
        }
        // getting rows
        const rows = await table.$$('tbody tr');
        let array = []

        for (const row of rows) {
          array.push(await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
            return {
              [table_headers[index]] : option.textContent
            }
          }), table_headers));
        }
        let table_rows = array.flatMap((x,i)=>{
          return Object.assign({}, ...x)
        })
        table_rows = table_rows.map(x=> {
          return {
            ...x,
            'Команда': formatString(x['Команда'])
          }
        })
        groups.push({
          headers: table_headers.map(x=> {
            return {
              Header: x,
              accessor: x,
            }
          }),
          rows: table_rows
        })
      }

      // merge titles and tables
      let data = titles.map( (x,i) => {
        return {
          title: x,
          group: groups[i]
        }
      })

      return data

    } catch (error) {
      console.error(error)
    }
  } else {
    let table_headers = []
    let rowsValues = []
    try {
      if (!table_headers.length) {
        table_headers = await page.$$eval(
          ".tournament-standings-table [id^='standings'] table thead tr[class*='general-header'] th",
          (options) => options.map((option) => option.textContent)
        )
      }
    } catch (error) {
      console.error(error)
    }
    try {
      const rows = await page.$$('.tournament-standings-table table[id*="standings"] tbody tr');
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
    } catch (error) {
      console.error(error)
    }
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
  }
}
function formatString(str){
  // return str.trim().replace(/\s+/g, '').split(/(\d+)/).filter(Boolean).join(' ')
  return str.trim().split(/(\d+)/).filter(Boolean)
}