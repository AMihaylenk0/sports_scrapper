export async function getFootballStandings(page, standingsUrl){
  page.setDefaultTimeout(0)
  await page.goto(standingsUrl);
  await page.waitForSelector('.tournament-standings-table');
  let table_headers
  let rowsValues = []

  try {
    table_headers = await page.$$eval(
      ".tournament-standings-table [id^='standings'] table thead tr[class*='general-header'] th",
      (options) => options.map((option) => option.textContent)
    )
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
function formatString(str){
  // return str.trim().replace(/\s+/g, '').split(/(\d+)/).filter(Boolean).join(' ')
  return str.trim().split(/(\d+)/).filter(Boolean)
}