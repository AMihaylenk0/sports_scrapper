export async function getKHLStandings(page, league){
  let standings = []
  let glossary
  try {
    const tables = await page.$$('#tab-standings-conference .b-data_row');
      for (const table of tables) {
        let header = await table.$$eval('.b-subtitle_nav_cover h4', (options) => options.map( (option, index) => {
            return option.textContent
        }))
        let table_headers = await table.$$eval('.dataTables_scroll .dataTables_scrollHead table thead tr th', (options) => options.map( (option, index) => {
          if (option.textContent) {
            let title = option.getAttribute("title") || option.textContent
            let name = option.textContent
            return {
              title,
              name
            }
          }  
        }));
        let rowNodes = await table.$$('.dataTables_scroll .dataTables_scrollBody table tbody tr');
        let table_rows = []
        for (const row of rowNodes) {
          table_rows.push( await row.$$eval('td', (options, table_headers) => options.reduce((result, option, index) => {
            if (option.textContent && table_headers[index]) {
              result.push({
                [table_headers[index].name]: option.textContent.trim()
              })
            }
            return result
          },[]), table_headers))
        }
        !glossary && (glossary = table_headers.filter(Boolean));
        table_headers = table_headers.filter(Boolean).map(x=> {
          return {
            Header: x.name,
            accessor: x.name,
          }
        })
        standings.push({
          header,
          table_headers,
          table_rows,
        })
      }
  } catch (error) {
    console.error(error)
  }
  return {
    league,
    standings,
    glossary
  }
}
