export async function getTeamsStats(page){
  let table_headers
  let rowsValues = []
  try {
    table_headers = await page.$$eval(
      "#all_team_stats_totals table.sortable.stats_table.now_sortable thead tr th",
      (options) => options.map((option) => option.textContent)
    )
  } catch (error) {
    console.error(error)
  }
  try {
    const rows = await page.$$('#all_team_stats_totals table.sortable.stats_table.now_sortable tbody tr');
    let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
          return {
            [table_headers[index]] : option.textContent
          }
        }), table_headers));
      }
      let newarr = array.map(x=> {
        return Object.fromEntries(
          x.flatMap(item => {
            return Object.entries(item)
          })
          )
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