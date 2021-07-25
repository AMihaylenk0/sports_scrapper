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
      for (const row of rows) {
        let mappedRows = await row.$$eval('th, td', (options, table_headers) => options.map( (option, index) => {
          return {
            [table_headers[index]] : option.textContent
          }
        }), table_headers);
        rowsValues.push(mappedRows)
      }
  } catch (error) {
    console.error(error)
  }
  return {
    headers: table_headers,
    rows: rowsValues
  }
}